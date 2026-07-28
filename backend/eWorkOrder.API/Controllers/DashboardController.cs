using Microsoft.AspNetCore.Mvc;
using eWorkOrder.API.Services;

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
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var metrics = await _dashboardService.GetDashboardAsync();
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