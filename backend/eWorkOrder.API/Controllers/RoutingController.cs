using Microsoft.AspNetCore.Mvc;
using eWorkOrder.API.Services;
using eWorkOrder.API.Models.Responses;

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

        [HttpPost("import-json")]
        public async Task<IActionResult> ImportJson([FromBody] RoutingSheetDto routing)
        {
            if (routing == null || string.IsNullOrEmpty(routing.JobNo))
                return BadRequest(new { error = "Data tidak valid." });

            try
            {
                _logger.LogInformation("Import JSON routing: {JobNo}", routing.JobNo);

                // Log jumlah operasi yang di-import
                _logger.LogInformation("Total operations to import: {Count}", routing.Operations?.Count ?? 0);

                // Validasi tambahan - cek apakah ada operasi
                if (routing.Operations == null || routing.Operations.Count == 0)
                {
                    _logger.LogWarning("No operations found in JSON data for JobNo: {JobNo}", routing.JobNo);
                    return BadRequest(new { error = "Tidak ada operasi yang ditemukan dalam data." });
                }

                var (success, message) = await _routingDbService.SaveRoutingAsync(routing);

                if (!success)
                {
                    _logger.LogWarning("Failed to save routing: {Message}", message);
                    return BadRequest(new { error = message });
                }

                _logger.LogInformation("Successfully imported routing for JobNo: {JobNo} with {Count} operations", 
                    routing.JobNo, routing.Operations.Count);

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
                _logger.LogError(ex, "Import JSON error for JobNo: {JobNo}", routing?.JobNo ?? "null");
                return StatusCode(500, new { error = "Gagal import routing JSON." });
            }
        }
    }
}