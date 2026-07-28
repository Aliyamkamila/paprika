using eWorkOrder.API.Data.Repositories;
using eWorkOrder.API.Models.Responses;

namespace eWorkOrder.API.Services
{
    public class DashboardService
    {
        private readonly WorkOrderRepository _repo;

        public DashboardService(WorkOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<DashboardResponseDto> GetDashboardAsync()
        {
            var data = await _repo.GetDashboardDataAsync();

            return new DashboardResponseDto
            {
                TotalWO          = data.TotalWO,
                Released         = data.Released,
                Closed           = data.Closed,
                Failed           = data.Failed,
                Complete         = data.Complete,
                ImportedRows     = data.ImportedRows,
                UniqueOperations = data.UniqueOperations,
                TotalDepartments = data.TotalDepartments,
                UnmappedOpStatus = 0,
                Departments      = data.Departments.Select(d => new DepartmentStatsDto
                {
                    DepartmentCode = d.Code,
                    DepartmentName = MapDept(d.Code),
                    OperationCount = d.OperationCount,
                    EmployeeCount  = d.EmployeeCount,
                }).ToArray(),
                OperationStats = new OperationStatsDto
                {
                    NotStarted = data.OpNotStarted,
                    InProgress = data.OpInProgress,
                    Completed  = data.OpCompleted,
                }
            };
        }

        private string MapDept(string code) => code switch
        {
            "MACH" => "Machining",
            "QC"   => "Quality Control",
            "TA"   => "Technical Assembly",
            "WELD" => "Welding",
            "ME"   => "Mechanical Engineering",
            "WHS"  => "Warehouse",
            "OSP"  => "Outside Process",
            _      => code
        };
    }
}