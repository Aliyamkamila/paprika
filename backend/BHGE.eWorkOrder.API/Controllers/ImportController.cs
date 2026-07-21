using Microsoft.AspNetCore.Mvc;
using BHGE.eWorkOrder.API.Services;
using BHGE.eWorkOrder.API.Models.Responses;

namespace BHGE.eWorkOrder.API.Controllers
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
        [ProducesResponseType(typeof(ImportResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ImportResponseDto), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ImportExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ImportResponseDto
                {
                    Success = false,
                    Message = "File tidak ditemukan",
                    Errors = new List<string> { "Silakan upload file Excel" }
                });
            }

            if (!IsValidExcelFile(file.FileName))
            {
                return BadRequest(new ImportResponseDto
                {
                    Success = false,
                    Message = "File format tidak valid",
                    Errors = new List<string> { "Hanya file .xlsx atau .xls yang diperbolehkan" }
                });
            }

            try
            {
                _logger.LogInformation($"Mulai import file: {file.FileName}");

                var (success, totalRows, errors) = await _excelReaderService.ReadExcelAsync(file);

                if (!success)
                {
                    return BadRequest(new ImportResponseDto
                    {
                        Success = false,
                        Message = "Gagal membaca file Excel",
                        TotalRows = totalRows,
                        Errors = errors
                    });
                }

                var cachedData = _excelReaderService.GetCachedData();
                var validRows = cachedData.Count;

                _logger.LogInformation($"Import berhasil: {validRows} rows");

                return Ok(new ImportResponseDto
                {
                    Success = true,
                    TotalRows = totalRows,
                    ValidRows = validRows,
                    InvalidRows = Math.Max(0, totalRows - validRows),
                    Message = $"Import berhasil! {validRows} data siap diproses",
                    Errors = errors
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during import: {ex.Message}");
                return StatusCode(500, new ImportResponseDto
                {
                    Success = false,
                    Message = "Terjadi kesalahan saat import",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        private bool IsValidExcelFile(string fileName)
        {
            return fileName.EndsWith(".xlsx") || fileName.EndsWith(".xls");
        }
    }
}