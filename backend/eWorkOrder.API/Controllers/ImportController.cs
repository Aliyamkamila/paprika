using Microsoft.AspNetCore.Mvc;
using eWorkOrder.API.Services;
using eWorkOrder.API.Models.Responses;

namespace eWorkOrder.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImportController : ControllerBase
    {
        private readonly ExcelReaderService _excelReaderService;
        private readonly ILogger<ImportController> _logger;

        public ImportController(ExcelReaderService excelReaderService, ILogger<ImportController> logger)
        {
            _excelReaderService = excelReaderService;
            _logger = logger;
        }

        [HttpPost]
        [RequestSizeLimit(long.MaxValue)]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
        public async Task<IActionResult> ImportExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new ImportResponseDto
                {
                    Success = false,
                    Message = "File tidak ditemukan.",
                    Errors = new List<string> { "Upload file Excel dulu." }
                });

            if (!file.FileName.EndsWith(".xlsx") && !file.FileName.EndsWith(".xls"))
                return BadRequest(new ImportResponseDto
                {
                    Success = false,
                    Message = "Format file tidak valid.",
                    Errors = new List<string> { "Hanya .xlsx atau .xls yang diterima." }
                });

            _logger.LogInformation("Import: {FileName}", file.FileName);

            var (success, totalRows, errors) = await _excelReaderService.ImportAsync(file);

            if (!success)
                return BadRequest(new ImportResponseDto
                {
                    Success = false,
                    Message = "Gagal membaca file.",
                    TotalRows = totalRows,
                    Errors = errors
                });

            var validRows = _excelReaderService.GetImportedRows();

            return Ok(new ImportResponseDto
            {
                Success     = true,
                TotalRows   = totalRows,
                ValidRows   = validRows,
                InvalidRows = Math.Max(0, totalRows - validRows),
                Message     = $"Import berhasil! {validRows} data siap diproses.",
                Errors      = errors
            });
        }
    }
}