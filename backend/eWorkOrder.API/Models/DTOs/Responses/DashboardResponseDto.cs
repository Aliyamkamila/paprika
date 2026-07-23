namespace eWorkOrder.API.Models.Responses
{
    public class DashboardResponseDto
    {
        public int TotalWO { get; set; }
        public int Released { get; set; }
        public int Closed { get; set; }
        public int Failed { get; set; }
        public int Complete { get; set; }

        public int ImportedRows { get; set; }
        public int UniqueOperations { get; set; }   // operation number unik
        public int TotalDepartments { get; set; }
        public int UnmappedOpStatus { get; set; }   // untuk debug selisih

        public DepartmentStatsDto[]? Departments { get; set; }
        public OperationStatsDto? OperationStats { get; set; }
    }

    public class DepartmentStatsDto
    {
        public string? DepartmentCode { get; set; }
        public string? DepartmentName { get; set; }
        public int OperationCount { get; set; }
        public int EmployeeCount { get; set; }
    }

    public class OperationStatsDto
    {
        public int NotStarted { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }
        public int NoStatus { get; set; }   // tambah ini untuk status yang tidak terpetakan
    }
}