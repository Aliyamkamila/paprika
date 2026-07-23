namespace eWorkOrder.API.Models.Domain
{
    public class DashboardSummary
    {
        public int ImportedRows     { get; set; }
        public int TotalWO          { get; set; }
        public int Released         { get; set; }
        public int Closed           { get; set; }
        public int Failed           { get; set; }
        public int Complete         { get; set; }
        public int UniqueOperations { get; set; }
        public int TotalDepartments { get; set; }
        public int UnmappedOpStatus { get; set; }

        public int OpNotStarted     { get; set; }
        public int OpInProgress     { get; set; }
        public int OpCompleted      { get; set; }

        public List<DeptSummary> Departments { get; set; } = new();
    }

    public class DeptSummary
    {
        public string? Code           { get; set; }
        public string? Name           { get; set; }
        public int     OperationCount { get; set; }
        public int     EmployeeCount  { get; set; }
    }
}