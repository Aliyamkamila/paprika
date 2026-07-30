using Microsoft.AspNetCore.Mvc;
using eWorkOrder.API.Services;

namespace eWorkOrder.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkOrderController : ControllerBase
    {
        private readonly WorkOrderService _workOrderService;
        private readonly ILogger<WorkOrderController> _logger;

        public WorkOrderController(WorkOrderService workOrderService, ILogger<WorkOrderController> logger)
        {
            _workOrderService = workOrderService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkOrders(
            [FromQuery] string? search,
            [FromQuery] string? status,
            [FromQuery] string? department,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                _logger.LogInformation("GetWorkOrders page={Page}", page);
                var result = await _workOrderService.GetWorkOrdersAsync(search, status, department, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("WorkOrder error: {Message}", ex.Message);
                return StatusCode(500, new { error = "Gagal ambil data work order." });
            }
        }

        [HttpGet("{woNumber}")]
        public async Task<IActionResult> GetWorkOrderDetail(string woNumber)
        {
            try
            {
                _logger.LogInformation("GetWorkOrderDetail: {WoNumber}", woNumber);
                var result = await _workOrderService.GetDetailAsync(woNumber);

                if (result == null)
                    return NotFound(new { error = $"WO '{woNumber}' tidak ditemukan." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("WO Detail error: {Message}", ex.Message);
                return StatusCode(500, new { error = "Gagal ambil detail WO." });
            }
        }

        [HttpGet("{woNumber}/operations/{operationNum}")]
        public async Task<IActionResult> GetOperationDetail(string woNumber, string operationNum)
        {
            try
            {
                _logger.LogInformation("GetOperationDetail: WO={WoNumber}, Operation={OperationNum}", woNumber, operationNum);
                var result = await _workOrderService.GetOperationDetailAsync(woNumber, operationNum);
                
                if (result == null)
                    return NotFound(new { error = "Operation tidak ditemukan." });
                    
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("Operation Detail error: {Message}", ex.Message);
                return StatusCode(500, new { error = "Gagal ambil detail operation." });
            }
        }

        [HttpPost("{woNumber}/operations/{operationNum}/notes")]
        public async Task<IActionResult> CreateNote(string woNumber, string operationNum, [FromBody] CreateNoteRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.NoteText))
                    return BadRequest(new { error = "Note text tidak boleh kosong." });

                _logger.LogInformation("CreateNote: WO={WoNumber}, Op={OperationNum}", woNumber, operationNum);
                var result = await _workOrderService.CreateNoteAsync(woNumber, operationNum, request.NoteText.Trim(), request.AuthorName ?? "User", request.AuthorDept ?? "-");

                if (result == null)
                    return NotFound(new { error = "Operation tidak ditemukan." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("CreateNote error: {Message}", ex.Message);
                return StatusCode(500, new { error = "Gagal menyimpan note." });
            }
        }
    }

    public class CreateNoteRequest
    {
        public string? NoteText { get; set; }
        public string? AuthorName { get; set; }
        public string? AuthorDept { get; set; }
    }
}
