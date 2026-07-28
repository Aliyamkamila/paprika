using UglyToad.PdfPig;
using eWorkOrder.API.Models.Responses;
using System.Text.RegularExpressions;

namespace eWorkOrder.API.Services
{
    public class RoutingSheetService
    {
        private readonly ILogger<RoutingSheetService> _logger;

        public RoutingSheetService(ILogger<RoutingSheetService> logger)
        {
            _logger = logger;
        }

        public async Task<RoutingSheetDto> ParseAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            var result = new RoutingSheetDto();

            using var pdf = PdfDocument.Open(stream.ToArray());

            var allLines = new List<string>();

            foreach (var page in pdf.GetPages())
            {
                var words = page.GetWords();
                var lineGroups = words
                    .GroupBy(w => Math.Round(w.BoundingBox.Bottom, 0))
                    .OrderByDescending(g => g.Key);

                foreach (var lineGroup in lineGroups)
                {
                    var lineText = string.Join(" ", lineGroup
                        .OrderBy(w => w.BoundingBox.Left)
                        .Select(w => w.Text));
                    if (!string.IsNullOrWhiteSpace(lineText))
                        allLines.Add(lineText);
                }
            }

            // Log semua lines untuk debug
            _logger.LogInformation("Total lines extracted from PDF: {Count}", allLines.Count);
            _logger.LogDebug("PDF Lines: {Lines}", string.Join(Environment.NewLine, allLines.Take(50)));

            // Parse header
            result.JobNo           = ExtractAfter(allLines, "Job No:");
            result.ItemDescription = ExtractAfter(allLines, "Item Description:");
            result.Quantity        = ExtractAfter(allLines, "Qty:");  // Sekarang valid
            result.SerialNo        = ExtractAfter(allLines, "Serial No:");
            result.SalesOrder      = ExtractAfter(allLines, "Sales Order");
            result.ScheduledStart  = ExtractAfter(allLines, "Scheduled Start:");
            result.ScheduledFinish = ExtractAfter(allLines, "Scheduled Finish:");
            result.BarcodeJobNo    = result.JobNo;
            result.BarcodeAssembly = ExtractAfter(allLines, "Assembly:");

            // Log header hasil parsing
            _logger.LogInformation("Parsed Header - JobNo: {JobNo}, Description: {Desc}, Qty: {Qty}", 
                result.JobNo, result.ItemDescription, result.Quantity);

            // Parse operations
            result.Operations = ParseOperations(allLines);

            _logger.LogInformation("Parsed {Count} operations from PDF", result.Operations.Count);
            
            // Log detail operasi
            foreach (var op in result.Operations)
            {
                _logger.LogInformation("Operation {OpNo}: Dept={Dept}, Machine={Machine}, Instructions={InstCount}, Materials={MatCount}", 
                    op.OperationNo, 
                    op.Department ?? "NULL", 
                    op.Machine ?? "NULL",
                    op.WorkInstructions?.Count ?? 0,
                    op.Materials?.Count ?? 0);
            }

            return result;
        }

        private List<RoutingOpDto> ParseOperations(List<string> lines)
        {
            var ops = new List<RoutingOpDto>();
            var opRegex = new Regex(@"Operation No\s*[:\-]?\s*(\d+)", RegexOptions.IgnoreCase);

            RoutingOpDto? currentOp = null;
            bool inWorkInstruction = false;
            bool inMaterials = false;

            _logger.LogInformation("Starting to parse operations from {LineCount} lines", lines.Count);

            for (int i = 0; i < lines.Count; i++)
            {
                var line = lines[i].Trim();
                if (string.IsNullOrWhiteSpace(line)) continue;

                var opMatch = opRegex.Match(line);
                if (opMatch.Success)
                {
                    if (currentOp != null)
                    {
                        _logger.LogDebug("Closing operation {OpNo} with Dept={Dept}, Machine={Machine}",
                            currentOp.OperationNo, currentOp.Department, currentOp.Machine);
                        ops.Add(currentOp);
                    }

                    currentOp = new RoutingOpDto
                    {
                        OperationNo = opMatch.Groups[1].Value,
                        BarcodeValue = opMatch.Groups[1].Value,
                    };

                    // Tambah ini untuk debug
                    _logger.LogInformation("Found Op: {OpNo}, Line: {Line}",
                        opMatch.Groups[1].Value, line);

                    var descMatch = Regex.Match(line, @"Operation Description[:\s]+(.+)", RegexOptions.IgnoreCase);
                    if (descMatch.Success)
                    {
                        currentOp.OperationDescription = descMatch.Groups[1].Value.Trim();
                        _logger.LogDebug("Operation {OpNo} Description: {Desc}",
                            currentOp.OperationNo, currentOp.OperationDescription);
                    }

                    inWorkInstruction = false;
                    inMaterials = false;
                    continue;
                }

                if (currentOp == null) continue;

                // ========== FIX: Department & Machine parsing ==========
                if (line.StartsWith("Department:", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogDebug("Processing Department line: {Line}", line);

                    // Format: "Department: ME Operation Code / Machine: ME101"
                    // Ambil hanya dept code, bukan seluruh baris
                    var deptMatch = Regex.Match(line, @"Department:\s*(\w+)", RegexOptions.IgnoreCase);
                    if (deptMatch.Success)
                    {
                        currentOp.Department = deptMatch.Groups[1].Value.Trim();
                        _logger.LogDebug("Set Department for Op {OpNo}: {Dept}",
                            currentOp.OperationNo, currentOp.Department);
                    }

                    // Sekalian ambil machine dari baris yang sama
                    var machMatch = Regex.Match(line, @"(?:Operation Code\s*/\s*Machine:|Machine:)\s*(\S+)", RegexOptions.IgnoreCase);
                    if (machMatch.Success)
                    {
                        currentOp.Machine = machMatch.Groups[1].Value.Trim();
                        _logger.LogDebug("Set Machine for Op {OpNo}: {Machine}",
                            currentOp.OperationNo, currentOp.Machine);
                    }

                    continue;
                }

                // Skip baris "Operation Code / Machine" yang berdiri sendiri
                if (line.Contains("Operation Code", StringComparison.OrdinalIgnoreCase) &&
                    !line.StartsWith("Department:", StringComparison.OrdinalIgnoreCase))
                {
                    var machMatch = Regex.Match(line, @"(?:Operation Code\s*/\s*Machine:|Machine:)\s*(\S+)", RegexOptions.IgnoreCase);
                    if (machMatch.Success)
                    {
                        currentOp.Machine = machMatch.Groups[1].Value.Trim();
                        _logger.LogDebug("Set Machine from standalone line for Op {OpNo}: {Machine}",
                            currentOp.OperationNo, currentOp.Machine);
                    }
                    continue;
                }
                // ======================================================

                if (line.StartsWith("Scheduled Start:", StringComparison.OrdinalIgnoreCase))
                {
                    currentOp.ScheduledStart = ExtractInline(line, "Scheduled Start:");
                    _logger.LogDebug("Set ScheduledStart for Op {OpNo}: {Start}",
                        currentOp.OperationNo, currentOp.ScheduledStart);
                    continue;
                }

                if (line.StartsWith("Scheduled Finish:", StringComparison.OrdinalIgnoreCase))
                {
                    currentOp.ScheduledFinish = ExtractInline(line, "Scheduled Finish:");
                    _logger.LogDebug("Set ScheduledFinish for Op {OpNo}: {Finish}",
                        currentOp.OperationNo, currentOp.ScheduledFinish);
                    continue;
                }

                if (line.StartsWith("NOTE", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("WF ID#", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("STD ROUTING", StringComparison.OrdinalIgnoreCase))
                {
                    inWorkInstruction = true;
                    inMaterials = false;
                    currentOp.WorkInstructions.Add(line);
                    _logger.LogDebug("Added work instruction for Op {OpNo}: {Instruction}",
                        currentOp.OperationNo, line);
                    continue;
                }

                if (line.StartsWith("Requirements", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("Component Item", StringComparison.OrdinalIgnoreCase))
                {
                    inMaterials = true;
                    inWorkInstruction = false;
                    _logger.LogDebug("Starting materials section for Op {OpNo}", currentOp.OperationNo);
                    continue;
                }

                if (line.StartsWith("Resource Seq", StringComparison.OrdinalIgnoreCase))
                {
                    inWorkInstruction = false;
                    inMaterials = false;
                    _logger.LogDebug("Ending materials section for Op {OpNo}", currentOp.OperationNo);
                    continue;
                }

                if (inWorkInstruction && line.Length > 3)
                {
                    currentOp.WorkInstructions.Add(line);
                    _logger.LogDebug("Added work instruction (continued) for Op {OpNo}: {Instruction}",
                        currentOp.OperationNo, line);
                    continue;
                }

                if (inMaterials && line.Length > 3)
                {
                    currentOp.Materials.Add(line);
                    _logger.LogDebug("Added material for Op {OpNo}: {Material}",
                        currentOp.OperationNo, line);
                    continue;
                }
            }

            if (currentOp != null)
            {
                _logger.LogDebug("Closing final operation {OpNo} with Dept={Dept}, Machine={Machine}",
                    currentOp.OperationNo, currentOp.Department, currentOp.Machine);
                ops.Add(currentOp);
            }

            _logger.LogInformation("Finished parsing operations. Total operations found: {Count}", ops.Count);

            // Log summary of all operations
            foreach (var op in ops)
            {
                _logger.LogInformation("Operation Summary - No: {OpNo}, Dept: {Dept}, Machine: {Machine}, Instructions: {InstCount}, Materials: {MatCount}",
                    op.OperationNo,
                    op.Department ?? "Not set",
                    op.Machine ?? "Not set",
                    op.WorkInstructions?.Count ?? 0,
                    op.Materials?.Count ?? 0);
            }

            return ops;
        }

        private string? ExtractAfter(List<string> lines, string key)
        {
            foreach (var line in lines)
            {
                var idx = line.IndexOf(key, StringComparison.OrdinalIgnoreCase);
                if (idx >= 0)
                {
                    var after = line.Substring(idx + key.Length).Trim();
                    if (!string.IsNullOrEmpty(after))
                        return after.Split(' ').FirstOrDefault();
                }
            }
            return null;
        }

        private string? ExtractInline(string line, string key)
        {
            var idx = line.IndexOf(key, StringComparison.OrdinalIgnoreCase);
            if (idx < 0) return null;
            return line.Substring(idx + key.Length).Trim();
        }
    }
}