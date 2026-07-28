using System.Text.Json.Serialization;

namespace eWorkOrder.API.Models.Responses
{
    public class RoutingSheetDto
    {
        public string? JobNo { get; set; }
        public string? ItemDescription { get; set; }
        public string? Quantity { get; set; }  // Tambahkan properti ini
        public string? SerialNo { get; set; }
        public string? SalesOrder { get; set; }
        public string? ScheduledStart { get; set; }
        public string? ScheduledFinish { get; set; }
        public string? BarcodeJobNo { get; set; }
        public string? BarcodeAssembly { get; set; }
        public List<RoutingOpDto> Operations { get; set; } = new();
    }

    public class RoutingOpDto
    {
        public string OperationNo { get; set; } = "";
        public string? OperationDescription { get; set; }
        public string? Department { get; set; }
        
        private string? _machine;
        public string? Machine 
        { 
            get => _machine; 
            set => _machine = value; 
        }
        
        public string? OperationCodeMachine { get; set; }
        public string? BarcodeValue { get; set; }
        public string? ScheduledStart { get; set; }
        public string? ScheduledFinish { get; set; }
        
        private List<string>? _workInstructions;
        public List<string> WorkInstructions 
        { 
            get => _workInstructions ??= new List<string>(); 
            set => _workInstructions = value; 
        }
        
        private List<string>? _materials;
        public List<string> Materials 
        { 
            get => _materials ??= new List<string>(); 
            set => _materials = value; 
        }
        
        private List<RoutingStepDto>? _steps;
        public List<RoutingStepDto> Steps 
        { 
            get => _steps ??= new List<RoutingStepDto>(); 
            set => _steps = value; 
        }
    }

    public class RoutingStepDto
    {
        public string? StepNo { get; set; }
        public string? Text { get; set; }
        public string? InspectRole { get; set; }
    }
}