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
        public IActionResult GetWorkOrders(
            [FromQuery] string? search,
            [FromQuery] string? status,
            [FromQuery] string? department,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                _logger.LogInformation("GetWorkOrders page={Page}", page);
                var result = _workOrderService.GetWorkOrders(search, status, department, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("WorkOrder error: {Message}", ex.Message);
                return StatusCode(500, new { error = "Gagal ambil data work order." });
            }
        }

        [HttpGet("{woNumber}")]
        public IActionResult GetWorkOrderDetail(string woNumber)
        {
            try
            {
                _logger.LogInformation("GetWorkOrderDetail: {WoNumber}", woNumber);
                var result = _workOrderService.GetDetail(woNumber);

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
    }
}