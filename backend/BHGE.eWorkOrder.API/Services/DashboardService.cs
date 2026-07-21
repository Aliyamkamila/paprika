using BHGE.eWorkOrder.API.Models.DTOs;
using BHGE.eWorkOrder.API.Models.Responses;

namespace BHGE.eWorkOrder.API.Services
{
    public class DashboardService
    {
        private readonly ExcelReaderService _excelReaderService;

        public DashboardService(ExcelReaderService excelReaderService)
        {
            _excelReaderService = excelReaderService;
        }

        public DashboardResponseDto GetDashboardMetrics()
        {
            var data = _excelReaderService.GetCachedData();

            if (data.Count == 0)
            {
                return new DashboardResponseDto
                {
                    Departments = Array.Empty<DepartmentStatsDto>(),
                    OperationStats = new OperationStatsDto()
                };
            }

            // Count WO Status
            var totalWO = data.Select(x => x.WoNumber).Distinct().Count();
            var released = data.Count(x => x.WoStatus == "Released");
            var closed = data.Count(x => x.WoStatus == "Closed");
            var failed = data.Count(x => x.WoStatus == "Failed Close");
            var complete = data.Count(x => x.WoStatus?.Contains("Complete") ?? false);

            // Department Stats
            var departments = data
                .GroupBy(x => x.DepartmentCode)
                .Where(g => !string.IsNullOrEmpty(g.Key))
                .Select(g => new DepartmentStatsDto
                {
                    DepartmentCode = g.Key,
                    DepartmentName = GetDepartmentName(g.Key),
                    OperationCount = g.Count(),
                    EmployeeCount = g.Select(x => x.EmployeeId).Distinct().Count()
                })
                .ToArray();

            // Operation Stats
            var operationStats = new OperationStatsDto
            {
                NotStarted = data.Count(x => x.OpStatus == "NOT STARTED"),
                InProgress = data.Count(x => x.OpStatus == "IN PROGRESS"),
                Completed = data.Count(x => x.OpStatus == "COMPLETED")
            };

            return new DashboardResponseDto
            {
                TotalWO = totalWO,
                Released = released,
                Closed = closed,
                Failed = failed,
                Complete = complete,
                Departments = departments,
                OperationStats = operationStats
            };
        }

            private string GetDepartmentName(string? code)
            {
                return code switch
                {
                    "MACH" => "Machining",
                    "QC" => "Quality Control",
                    "TA" => "Technical Assembly",
                    "WELD" => "Welding",
                    _ => code ?? "Unknown"
                };
            }
    }
}