using OfficeOpenXml;
using eWorkOrder.API.Models.DTOs;
using eWorkOrder.API.Models.Domain;
using eWorkOrder.API.Helpers;

namespace eWorkOrder.API.Services
{
    public class ExcelReaderService
    {
        private Dictionary<string, WorkOrder> _workOrders = new();
        private DashboardSummary?             _summary;
        private int                           _importedRows;

        private readonly ILogger<ExcelReaderService> _logger;

        public ExcelReaderService(ILogger<ExcelReaderService> logger)
        {
            ExcelPackage.License.SetNonCommercialPersonal("eWorkOrder");
            _logger = logger;
        }

        public async Task<(bool Success, int TotalRows, List<string> Errors)> ImportAsync(IFormFile file)
        {
            var errors = new List<string>();

            try
            {
                _logger.LogInformation("Import started: {FileName}", file.FileName);

                using var stream = new MemoryStream();
                await file.CopyToAsync(stream);
                stream.Position = 0;

                using var package  = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[Constants.ExcelSheetName];

                if (worksheet == null)
                {
                    errors.Add($"Sheet '{Constants.ExcelSheetName}' tidak ditemukan.");
                    return (false, 0, errors);
                }

                var totalRows = worksheet.Dimension?.Rows ?? 0;
                if (totalRows <= 1)
                {
                    errors.Add("File kosong atau hanya header.");
                    return (false, 0, errors);
                }

                // Step 1 — Read rows into ExcelRowDto
                var rawRows = new List<ExcelRowDto>();
                for (int row = 2; row <= totalRows; row++)
                {
                    try
                    {
                        var woNumber = worksheet.Cells[row, ExcelColumns.WoNumber].Value?.ToString()?.Trim();
                        if (string.IsNullOrEmpty(woNumber)) continue;

                        rawRows.Add(new ExcelRowDto
                        {
                            WoNumber       = woNumber,
                            Description    = worksheet.Cells[row, ExcelColumns.Description].Value?.ToString(),
                            Quantity       = ToInt(worksheet.Cells[row, ExcelColumns.Quantity].Value),
                            WoStatus       = worksheet.Cells[row, ExcelColumns.WoStatus].Value?.ToString(),
                            OperationNum   = worksheet.Cells[row, ExcelColumns.OperationNum].Value?.ToString(),
                            OpDescription  = worksheet.Cells[row, ExcelColumns.OpDescription].Value?.ToString(),
                            OpStatus       = worksheet.Cells[row, ExcelColumns.OpStatus].Value?.ToString(),
                            DepartmentCode = worksheet.Cells[row, ExcelColumns.DepartmentCode].Value?.ToString(),
                            MachineCode    = worksheet.Cells[row, ExcelColumns.MachineCode].Value?.ToString(),
                            ResourceCode   = worksheet.Cells[row, ExcelColumns.ResourceCode].Value?.ToString(),
                            EmployeeId     = worksheet.Cells[row, ExcelColumns.EmployeeId].Value?.ToString(),
                            EmployeeName   = worksheet.Cells[row, ExcelColumns.EmployeeName].Value?.ToString(),
                            StdHours       = ToDecimal(worksheet.Cells[row, ExcelColumns.StdHours].Value),
                            ActHours       = ToDecimal(worksheet.Cells[row, ExcelColumns.ActHours].Value),
                            ClockIn        = ToDateTime(worksheet.Cells[row, ExcelColumns.ClockIn].Value),
                            ClockOut       = ToDateTime(worksheet.Cells[row, ExcelColumns.ClockOut].Value),
                        });
                    }
                    catch (Exception ex)
                    {
                        errors.Add($"Row {row}: {ex.Message}");
                    }
                }

                // Step 2 — Map to domain models
                _workOrders   = WorkOrderMapper.MapToWorkOrders(rawRows);
                _importedRows = rawRows.Count;

                // Step 3 — Build summary once
                _summary = WorkOrderMapper.BuildSummary(_workOrders, _importedRows);

                _logger.LogInformation(
                    "Import done: {Rows} rows, {WOs} WOs, {Errors} errors",
                    _importedRows, _workOrders.Count, errors.Count);

                return (true, _importedRows, errors);
            }
            catch (Exception ex)
            {
                _logger.LogError("Import failed: {Message}", ex.Message);
                errors.Add($"Error: {ex.Message}");
                return (false, 0, errors);
            }
        }

        public Dictionary<string, WorkOrder> GetWorkOrders() => _workOrders;
        public DashboardSummary?             GetSummary()    => _summary;
        public int                           GetImportedRows()=> _importedRows;

        private int?      ToInt(object? v)      => int.TryParse(v?.ToString(), out var r) ? r : null;
        private decimal?  ToDecimal(object? v)  => decimal.TryParse(v?.ToString(), out var r) ? r : null;
        private DateTime? ToDateTime(object? v) => DateTime.TryParse(v?.ToString(), out var r) ? r : null;
    }
}