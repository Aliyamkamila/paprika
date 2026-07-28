using eWorkOrder.API.Data.Repositories;
using eWorkOrder.API.Helpers;
using eWorkOrder.API.Models.Responses;

namespace eWorkOrder.API.Services
{
    public class WorkOrderService
    {
        private readonly WorkOrderRepository _repo;

        public WorkOrderService(WorkOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<WorkOrderListResponseDto> GetWorkOrdersAsync(
            string? search, string? status, string? department,
            int page, int pageSize)
        {
            var (total, data) = await _repo.GetWorkOrdersAsync(search, status, department, page, pageSize);

            var totalPages = (int)Math.Ceiling((double)total / pageSize);

            return new WorkOrderListResponseDto
            {
                TotalData  = total,
                Page       = page,
                PageSize   = pageSize,
                TotalPages = totalPages,
                Data       = data.Select(w => new WorkOrderSummaryDto
                {
                    WoNumber         = w.WoNumber,
                    Description      = w.Description,
                    Quantity         = w.Quantity,
                    WoStatus         = w.WoStatus,
                    PlannerCode      = w.PlannerCode,
                    Department       = w.Operations
                                        .GroupBy(o => o.DepartmentCode)
                                        .OrderByDescending(g => g.Count())
                                        .FirstOrDefault()?.Key,
                    CurrentOperation = w.Operations
                                        .OrderBy(o => o.OperationNum)
                                        .FirstOrDefault(o => o.OpStatus != "COMPLETED")?.OperationNum
                                        ?? w.Operations.LastOrDefault()?.OperationNum,
                    OperationCount   = w.Operations.Count,
                }).ToList()
            };
        }

        public async Task<WorkOrderDetailDto?> GetDetailAsync(string woNumber)
        {
            var wo = await _repo.GetWorkOrderDetailAsync(woNumber);
            if (wo == null) return null;

            return new WorkOrderDetailDto
            {
                WoNumber    = wo.WoNumber,
                Description = wo.Description,
                Quantity    = wo.Quantity,
                WoStatus    = wo.WoStatus,
                PlannerCode = wo.PlannerCode,
                Department  = wo.Operations
                                .GroupBy(o => o.DepartmentCode)
                                .OrderByDescending(g => g.Count())
                                .FirstOrDefault()?.Key,
                WoStartDate = wo.ScheduledStart?.ToString("dd/MM/yyyy"),
                WoEndDate   = wo.ScheduledFinish?.ToString("dd/MM/yyyy"),
                Operations  = wo.Operations
                    .OrderBy(o => {
                        int.TryParse(o.OperationNum, out var n);
                        return n;
                    })
                    .Select(o => new OperationTimelineDto
                    {
                        OperationNum = o.OperationNum,
                        Description  = o.Description,
                        Status       = o.OpStatus,
                        Department   = o.DepartmentCode,
                        Machine      = o.MachineCode,
                        EmployeeName = o.Employees
                                        .OrderByDescending(e => e.ClockOut)
                                        .FirstOrDefault()?.EmployeeName,
                        StdHours     = o.Employees.Sum(e => e.StdHours ?? 0),
                        ActHours     = o.Employees.Sum(e => e.ActHours ?? 0),
                        ClockIn      = o.Employees.Min(e => e.ClockIn)?.ToString("dd/MM/yyyy HH:mm"),
                        ClockOut     = o.Employees.Max(e => e.ClockOut)?.ToString("dd/MM/yyyy HH:mm"),
                    })
                    .ToList()
            };
        }

        public async Task<OperationDetailDto?> GetOperationDetailAsync(string woNumber, string operationNum)
        {
            return await _repo.GetOperationDetailAsync(woNumber, operationNum);
        }
    }
}