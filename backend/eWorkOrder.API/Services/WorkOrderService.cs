using eWorkOrder.API.Helpers;
using eWorkOrder.API.Models.Domain;
using eWorkOrder.API.Models.Responses;

namespace eWorkOrder.API.Services
{
    public class WorkOrderService
    {
        private readonly ExcelReaderService _reader;

        public WorkOrderService(ExcelReaderService reader)
        {
            _reader = reader;
        }

        public WorkOrderListResponseDto GetWorkOrders(
            string? search, string? status, string? department,
            int page, int pageSize)
        {
            var workOrders = _reader.GetWorkOrders().Values.AsQueryable();

            if (!string.IsNullOrEmpty(search))
                workOrders = workOrders.Where(w =>
                    (w.WoNumber    != null && w.WoNumber.Contains(search, StringComparison.OrdinalIgnoreCase)) ||
                    (w.Description != null && w.Description.Contains(search, StringComparison.OrdinalIgnoreCase)));

            if (!string.IsNullOrEmpty(status))
                workOrders = workOrders.Where(w =>
                    w.WoStatus != null && w.WoStatus.Trim().ToUpper() == status.Trim().ToUpper());

            if (!string.IsNullOrEmpty(department))
                workOrders = workOrders.Where(w =>
                    w.PrimaryDepartment != null && w.PrimaryDepartment.ToUpper() == department.Trim().ToUpper());

            var totalData  = workOrders.Count();
            var totalPages = (int)Math.Ceiling((double)totalData / pageSize);

            var paged = workOrders
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(w => new WorkOrderSummaryDto
                {
                    WoNumber         = w.WoNumber,
                    Description      = w.Description,
                    Quantity         = w.Quantity,
                    WoStatus         = w.WoStatus,
                    PlannerCode      = w.PlannerCode,
                    CurrentOperation = w.CurrentOperation,
                    Department       = w.PrimaryDepartment,
                    OperationCount   = w.TotalOperations
                })
                .ToList();

            return new WorkOrderListResponseDto
            {
                TotalData  = totalData,
                Page       = page,
                PageSize   = pageSize,
                TotalPages = totalPages,
                Data       = paged
            };
        }

        public WorkOrderDetailDto? GetDetail(string woNumber)
        {
            var workOrders = _reader.GetWorkOrders();
            if (!workOrders.TryGetValue(woNumber.Trim(), out var wo)) return null;

            return new WorkOrderDetailDto
            {
                WoNumber    = wo.WoNumber,
                Description = wo.Description,
                Quantity    = wo.Quantity,
                WoStatus    = wo.WoStatus,
                PlannerCode = wo.PlannerCode,
                Department  = wo.PrimaryDepartment,
                WoStartDate = wo.StartDate?.ToString("dd/MM/yyyy"),
                WoEndDate   = wo.EndDate?.ToString("dd/MM/yyyy"),
                Operations  = wo.Operations
                    .GroupBy(o => o.OperationNum)
                    .OrderBy(g => { int.TryParse(g.Key, out var n); return n; })
                    .Select(g => {
                        var latest = g.OrderByDescending(o => o.ClockOut).First();
                        return new OperationTimelineDto
                        {
                            OperationNum = g.Key,
                            Description  = latest.Description,
                            Status       = latest.Status,
                            Department   = latest.DepartmentCode,
                            Machine      = latest.MachineCode,
                            EmployeeName = latest.EmployeeName,
                            StdHours     = g.Sum(o => o.StdHours),
                            ActHours     = g.Sum(o => o.ActHours),
                            ClockIn      = latest.ClockIn?.ToString("dd/MM/yyyy HH:mm"),
                            ClockOut     = latest.ClockOut?.ToString("dd/MM/yyyy HH:mm"),
                        };
                    })
                    .ToList()
            };
        }
    }
}