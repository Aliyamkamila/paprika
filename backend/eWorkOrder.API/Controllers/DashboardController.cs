using Microsoft.AspNetCore.Mvc;
using eWorkOrder.API.Services;
using eWorkOrder.API.Models.Responses;

namespace eWorkOrder.API.Controllers
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
        public IActionResult GetDashboard()
        {
            try
            {
                _logger.LogInformation("Fetching dashboard metrics");
                var metrics = _dashboardService.GetDashboard();
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError("Dashboard error: {Message}", ex.Message);
                return StatusCode(500, new { error = "Gagal ambil data dashboard." });
            }
        }
    }
}