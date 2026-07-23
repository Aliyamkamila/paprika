using eWorkOrder.API.Models.Domain;
using eWorkOrder.API.Models.DTOs;

namespace eWorkOrder.API.Helpers
{
    public static class WorkOrderMapper
    {
        public static Dictionary<string, WorkOrder> MapToWorkOrders(List<ExcelRowDto> rows)
        {
            var result = new Dictionary<string, WorkOrder>(StringComparer.OrdinalIgnoreCase);

            foreach (var row in rows)
            {
                var woKey = row.WoNumber?.Trim();
                if (string.IsNullOrEmpty(woKey)) continue;

                if (!result.TryGetValue(woKey, out var wo))
                {
                    wo = new WorkOrder
                    {
                        WoNumber    = woKey,
                        Description = row.Description?.Trim(),
                        Quantity    = row.Quantity,
                        WoStatus    = row.WoStatus?.Trim(),
                        PlannerCode = row.ResourceCode?.Trim(),
                        StartDate   = row.ClockIn,
                        EndDate     = row.ClockOut,
                    };
                    result[woKey] = wo;
                }

                // Update dates
                if (row.ClockIn.HasValue && (wo.StartDate == null || row.ClockIn < wo.StartDate))
                    wo.StartDate = row.ClockIn;
                if (row.ClockOut.HasValue && (wo.EndDate == null || row.ClockOut > wo.EndDate))
                    wo.EndDate = row.ClockOut;

                wo.Operations.Add(new Operation
                {
                    OperationNum   = row.OperationNum?.Trim(),
                    Description    = row.OpDescription?.Trim(),
                    Status         = row.OpStatus?.Trim(),
                    DepartmentCode = row.DepartmentCode?.Trim(),
                    MachineCode    = row.MachineCode?.Trim(),
                    ResourceCode   = row.ResourceCode?.Trim(),
                    EmployeeId     = row.EmployeeId?.Trim(),
                    EmployeeName   = row.EmployeeName?.Trim(),
                    StdHours       = row.StdHours ?? 0,
                    ActHours       = row.ActHours ?? 0,
                    ClockIn        = row.ClockIn,
                    ClockOut       = row.ClockOut,
                });
            }

            return result;
        }

        public static DashboardSummary BuildSummary(Dictionary<string, WorkOrder> workOrders, int importedRows)
        {
            var allOps = workOrders.Values.SelectMany(w => w.Operations).ToList();

            var departments = workOrders.Values
                .SelectMany(w => w.Operations)
                .GroupBy(o => o.DepartmentCode?.Trim().ToUpper())
                .Where(g => !string.IsNullOrEmpty(g.Key))
                .Select(g => new DeptSummary
                {
                    Code           = g.Key,
                    Name           = Department.GetName(g.Key),
                    OperationCount = g.Count(),
                    EmployeeCount  = g.Select(o => o.EmployeeId).Distinct().Count()
                })
                .OrderByDescending(d => d.OperationCount)
                .ToList();

            return new DashboardSummary
            {
                ImportedRows     = importedRows,
                TotalWO          = workOrders.Count,
                Released         = workOrders.Values.Count(w => w.WoStatus?.Trim().ToUpper() == WoStatus.Released.ToUpper()),
                Closed           = workOrders.Values.Count(w => w.WoStatus?.Trim().ToUpper() == WoStatus.Closed.ToUpper()),
                Failed           = workOrders.Values.Count(w => w.WoStatus?.Trim().ToUpper() == WoStatus.FailedClose.ToUpper()),
                Complete         = workOrders.Values.Count(w => w.WoStatus?.Trim().ToUpper() == WoStatus.Completed.ToUpper()),
                UniqueOperations = allOps.Select(o => o.OperationNum).Distinct().Count(),
                TotalDepartments = departments.Count,
                UnmappedOpStatus = allOps.Count(o => {
                    var s = o.Status?.Trim().ToUpper();
                    return s != OpStatus.NotStarted && s != OpStatus.InProgress && s != OpStatus.Completed;
                }),
                OpNotStarted     = allOps.Count(o => o.Status?.Trim().ToUpper() == OpStatus.NotStarted),
                OpInProgress     = allOps.Count(o => o.Status?.Trim().ToUpper() == OpStatus.InProgress),
                OpCompleted      = allOps.Count(o => o.Status?.Trim().ToUpper() == OpStatus.Completed),
                Departments      = departments
            };
        }
    }
}