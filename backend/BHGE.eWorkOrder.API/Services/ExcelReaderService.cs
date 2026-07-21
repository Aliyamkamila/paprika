using OfficeOpenXml;
using BHGE.eWorkOrder.API.Models.DTOs;

namespace BHGE.eWorkOrder.API.Services
{
    public class ExcelReaderService
    {
        private static List<WorkOrderDto> _cachedData = new();

        public ExcelReaderService()
        {
           // EPPlus 7.0+ doesn't require license setup for non-commercial use
        }
        public async Task<(bool Success, int TotalRows, List<string> Errors)> ReadExcelAsync(IFormFile file)
        {
            var errors = new List<string>();
            int totalRows = 0;

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets[0];

                        if (worksheet == null)
                        {
                            errors.Add("Excel file tidak memiliki sheet");
                            return (false, 0, errors);
                        }

                        _cachedData.Clear();
                        totalRows = worksheet.Dimension?.Rows ?? 0;

                        if (totalRows <= 1)
                        {
                            errors.Add("Excel file kosong atau hanya header");
                            return (false, 0, errors);
                        }

                        // Skip header row (row 1)
                        for (int row = 2; row <= totalRows; row++)
                        {
                            try
                            {
                                var woNumber = worksheet.Cells[row, 1].Value?.ToString();
                                
                                // Skip empty rows
                                if (string.IsNullOrEmpty(woNumber))
                                    continue;

                                var dto = new WorkOrderDto
                                {
                                    WoNumber = woNumber,
                                    Description = worksheet.Cells[row, 2].Value?.ToString() ?? string.Empty,
                                    Quantity = GetIntValue(worksheet.Cells[row, 3].Value),
                                    WoStatus = worksheet.Cells[row, 4].Value?.ToString() ?? string.Empty,
                                    OperationNum = worksheet.Cells[row, 5].Value?.ToString() ?? string.Empty,
                                    OpDescription = worksheet.Cells[row, 6].Value?.ToString() ?? string.Empty,
                                    OpStatus = worksheet.Cells[row, 7].Value?.ToString() ?? string.Empty,
                                    DepartmentCode = worksheet.Cells[row, 8].Value?.ToString() ?? string.Empty,
                                    MachineCode = worksheet.Cells[row, 9].Value?.ToString() ?? string.Empty,
                                    ResourceCode = worksheet.Cells[row, 10].Value?.ToString() ?? string.Empty,
                                    EmployeeId = worksheet.Cells[row, 11].Value?.ToString() ?? string.Empty,
                                    EmployeeName = worksheet.Cells[row, 12].Value?.ToString() ?? string.Empty,
                                    StdHours = GetDecimalValue(worksheet.Cells[row, 13].Value),
                                    ActHours = GetDecimalValue(worksheet.Cells[row, 14].Value),
                                    ClockIn = GetDateTimeValue(worksheet.Cells[row, 15].Value),
                                    ClockOut = GetDateTimeValue(worksheet.Cells[row, 16].Value)
                                };

                                _cachedData.Add(dto);
                            }
                            catch (Exception ex)
                            {
                                errors.Add($"Row {row}: {ex.Message}");
                            }
                        }

                        return (true, _cachedData.Count, errors);
                    }
                }
            }
            catch (Exception ex)
            {
                errors.Add($"Error reading Excel: {ex.Message}");
                return (false, 0, errors);
            }
        }

        public List<WorkOrderDto> GetCachedData()
        {
            return _cachedData;
        }

        public void ClearCache()
        {
            _cachedData.Clear();
        }

        private int? GetIntValue(object value)
        {
            if (value == null) return null;
            if (int.TryParse(value.ToString(), out var result))
                return result;
            return null;
        }

        private decimal? GetDecimalValue(object value)
        {
            if (value == null) return null;
            if (decimal.TryParse(value.ToString(), out var result))
                return result;
            return null;
        }

        private DateTime? GetDateTimeValue(object value)
        {
            if (value == null) return null;
            if (DateTime.TryParse(value.ToString(), out var result))
                return result;
            return null;
        }
    }
}