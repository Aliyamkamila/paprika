namespace eWorkOrder.API.Helpers
{
    public static class WoStatus
    {
        public const string Released    = "Released";
        public const string Closed      = "Closed";
        public const string FailedClose = "Failed Close";
        public const string Completed   = "Completed";
    }

    public static class OpStatus
    {
        public const string NotStarted = "NOT STARTED";
        public const string InProgress = "IN PROGRESS";
        public const string Completed  = "COMPLETED";
    }

    public static class Department
    {
        public const string QC   = "QC";
        public const string MACH = "MACH";
        public const string TA   = "TA";
        public const string WELD = "WELD";

        public static string GetName(string? code) => code?.Trim().ToUpper() switch
        {
            "MACH" => "Machining",
            "QC"   => "Quality Control",
            "TA"   => "Technical Assembly",
            "WELD" => "Welding",
            _      => code ?? "Unknown"
        };
    }

    public static class ExcelColumns
    {
        public const int WoNumber      = 4;
        public const int Description   = 6;
        public const int Quantity      = 7;
        public const int OperationNum  = 8;
        public const int OpDescription = 9;
        public const int WoStatus      = 11;
        public const int OpStatus      = 12;
        public const int DepartmentCode= 14;
        public const int MachineCode   = 15;
        public const int ResourceCode  = 16;
        public const int StdHours      = 19;
        public const int ActHours      = 21;
        public const int EmployeeId    = 24;
        public const int EmployeeName  = 25;
        public const int ClockIn       = 26;
        public const int ClockOut      = 27;
    }

    public static class Constants
    {
        public const string ExcelSheetName = "Detailed";
    }
}