using Microsoft.AspNetCore.Mvc;
using BHGE.eWorkOrder.API.Services;
using BHGE.eWorkOrder.API.Models.Responses;

namespace BHGE.eWorkOrder.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(DashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(DashboardResponseDto), StatusCodes.Status200OK)]
        public IActionResult GetDashboard()
        {
            try
            {
                _logger.LogInformation("Fetching dashboard metrics");
                var metrics = _dashboardService.GetDashboardMetrics();
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching dashboard: {ex.Message}");
                return StatusCode(500, new { error = "Failed to fetch dashboard metrics" });
            }
        }
    }
}