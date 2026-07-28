using Microsoft.AspNetCore.Mvc;
using eWorkOrder.API.Services;

namespace eWorkOrder.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutingController : ControllerBase
    {
        private readonly RoutingSheetService _routingService;
        private readonly RoutingDbService    _routingDbService;
        private readonly ILogger<RoutingController> _logger;

        public RoutingController(
            RoutingSheetService routingService,
            RoutingDbService routingDbService,
            ILogger<RoutingController> logger)
        {
            _routingService   = routingService;
            _routingDbService = routingDbService;
            _logger           = logger;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(long.MaxValue)]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "File tidak ditemukan." });

            if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "Hanya file PDF yang diterima." });

            try
            {
                _logger.LogInformation("Parsing PDF: {FileName}", file.FileName);

                // Step 1 — Parse PDF
                var routing = await _routingService.ParseAsync(file);

                // Step 2 — Simpan ke DB
                var (success, message) = await _routingDbService.SaveRoutingAsync(routing);

                if (!success)
                    return BadRequest(new { error = message });

                return Ok(new
                {
                    success    = true,
                    message    = message,
                    jobNo      = routing.JobNo,
                    operations = routing.Operations.Count,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("Routing error: {Message}", ex.Message);
                return StatusCode(500, new { error = "Gagal parse PDF." });
            }
        }
    }
}