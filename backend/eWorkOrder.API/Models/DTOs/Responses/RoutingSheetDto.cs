namespace eWorkOrder.API.Models.Responses
{
    public class RoutingSheetDto
    {
        public string?            JobNo           { get; set; }
        public string?            ItemDescription { get; set; }
        public string?            Quantity        { get; set; }
        public string?            SerialNo        { get; set; }
        public string?            SalesOrder      { get; set; }
        public string?            ScheduledStart  { get; set; }
        public string?            ScheduledFinish { get; set; }
        public string?            BarcodeJobNo    { get; set; }
        public string?            BarcodeAssembly { get; set; }
        public List<RoutingOpDto> Operations      { get; set; } = new();
    }

    public class RoutingOpDto
    {
        public string?      OperationNo          { get; set; }
        public string?      OperationDescription { get; set; }
        public string?      Department           { get; set; }
        public string?      Machine              { get; set; }
        public string?      ScheduledStart       { get; set; }
        public string?      ScheduledFinish      { get; set; }
        public string?      BarcodeValue         { get; set; }
        public List<string> WorkInstructions     { get; set; } = new();
        public List<string> Materials            { get; set; } = new();
    }
}