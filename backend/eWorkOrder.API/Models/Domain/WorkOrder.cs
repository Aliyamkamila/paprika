namespace eWorkOrder.API.Models.Domain
{
    public class WorkOrder
    {
        public string?          WoNumber     { get; set; }
        public string?          Description  { get; set; }
        public int?             Quantity     { get; set; }
        public string?          WoStatus     { get; set; }
        public string?          PlannerCode  { get; set; }
        public DateTime?        StartDate    { get; set; }
        public DateTime?        EndDate      { get; set; }
        public List<Operation>  Operations   { get; set; } = new();

        // Computed
        public string?  PrimaryDepartment =>
            Operations.Select(o => o.DepartmentCode?.Trim())
                      .Where(d => !string.IsNullOrEmpty(d))
                      .GroupBy(d => d)
                      .OrderByDescending(g => g.Count())
                      .FirstOrDefault()?.Key;

        public string?  CurrentOperation =>
            Operations.FirstOrDefault(o =>
                o.Status?.Trim().ToUpper() != OpStatus.Completed)?.OperationNum
            ?? Operations.LastOrDefault()?.OperationNum;

        public int      TotalOperations  => Operations.Count;
        public int      CompletedOps     => Operations.Count(o => o.Status?.Trim().ToUpper() == OpStatus.Completed);
        public int      ProgressPct      => TotalOperations > 0
                                            ? (int)Math.Round((double)CompletedOps / TotalOperations * 100)
                                            : 0;
    }

    // Import OpStatus constant here to avoid circular using
    file static class OpStatus
    {
        public const string Completed = "COMPLETED";
    }
}