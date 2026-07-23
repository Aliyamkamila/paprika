using eWorkOrder.API.Models.Responses;

namespace eWorkOrder.API.Services
{
    public class DashboardService
    {
        private readonly ExcelReaderService _reader;

        public DashboardService(ExcelReaderService reader)
        {
            _reader = reader;
        }

        public DashboardResponseDto GetDashboard()
        {
            var s = _reader.GetSummary();
            if (s == null) return new DashboardResponseDto
            {
                Departments    = Array.Empty<DepartmentStatsDto>(),
                OperationStats = new OperationStatsDto()
            };

            return new DashboardResponseDto
            {
                TotalWO          = s.TotalWO,
                Released         = s.Released,
                Closed           = s.Closed,
                Failed           = s.Failed,
                Complete         = s.Complete,
                ImportedRows     = s.ImportedRows,
                UniqueOperations = s.UniqueOperations,
                TotalDepartments = s.TotalDepartments,
                UnmappedOpStatus = s.UnmappedOpStatus,
                Departments      = s.Departments.Select(d => new DepartmentStatsDto
                {
                    DepartmentCode = d.Code,
                    DepartmentName = d.Name,
                    OperationCount = d.OperationCount,
                    EmployeeCount  = d.EmployeeCount
                }).ToArray(),
                OperationStats   = new OperationStatsDto
                {
                    NotStarted = s.OpNotStarted,
                    InProgress = s.OpInProgress,
                    Completed  = s.OpCompleted
                }
            };
        }
    }
}