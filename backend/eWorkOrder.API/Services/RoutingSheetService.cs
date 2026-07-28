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

            // Parse header
            result.JobNo           = ExtractAfter(allLines, "Job No:");
            result.ItemDescription = ExtractAfter(allLines, "Item Description:");
            result.Quantity        = ExtractAfter(allLines, "Qty:");
            result.SerialNo        = ExtractAfter(allLines, "Serial No:");
            result.SalesOrder      = ExtractAfter(allLines, "Sales Order");
            result.ScheduledStart  = ExtractAfter(allLines, "Scheduled Start:");
            result.ScheduledFinish = ExtractAfter(allLines, "Scheduled Finish:");
            result.BarcodeJobNo    = result.JobNo;
            result.BarcodeAssembly = ExtractAfter(allLines, "Assembly:");

            // Parse operations
            result.Operations = ParseOperations(allLines);

            _logger.LogInformation("Parsed {Count} operations from PDF", result.Operations.Count);

            return result;
        }

        private List<RoutingOpDto> ParseOperations(List<string> lines)
        {
            var ops     = new List<RoutingOpDto>();
            var opRegex = new Regex(@"Operation No\s*[:\-]?\s*(\d+)", RegexOptions.IgnoreCase);

            RoutingOpDto? currentOp   = null;
            bool inWorkInstruction    = false;
            bool inMaterials          = false;

            for (int i = 0; i < lines.Count; i++)
            {
                var line = lines[i].Trim();
                if (string.IsNullOrWhiteSpace(line)) continue;

                var opMatch = opRegex.Match(line);
                if (opMatch.Success)
                {
                    if (currentOp != null) ops.Add(currentOp);

                    currentOp = new RoutingOpDto
                    {
                        OperationNo  = opMatch.Groups[1].Value,
                        BarcodeValue = opMatch.Groups[1].Value,
                    };

                    var descMatch = Regex.Match(line, @"Operation Description[:\s]+(.+)", RegexOptions.IgnoreCase);
                    if (descMatch.Success)
                        currentOp.OperationDescription = descMatch.Groups[1].Value.Trim();

                    inWorkInstruction = false;
                    inMaterials       = false;
                    continue;
                }

                if (currentOp == null) continue;

                // ========== FIX: Department & Machine parsing ==========
                if (line.StartsWith("Department:", StringComparison.OrdinalIgnoreCase))
                {
                    // Format: "Department: ME Operation Code / Machine: ME101"
                    // Ambil hanya dept code, bukan seluruh baris
                    var deptMatch = Regex.Match(line, @"Department:\s*(\w+)", RegexOptions.IgnoreCase);
                    if (deptMatch.Success)
                        currentOp.Department = deptMatch.Groups[1].Value.Trim();

                    // Sekalian ambil machine dari baris yang sama
                    var machMatch = Regex.Match(line, @"(?:Operation Code\s*/\s*Machine:|Machine:)\s*(\S+)", RegexOptions.IgnoreCase);
                    if (machMatch.Success)
                        currentOp.Machine = machMatch.Groups[1].Value.Trim();

                    continue;
                }

                // Skip baris "Operation Code / Machine" yang berdiri sendiri
                if (line.Contains("Operation Code", StringComparison.OrdinalIgnoreCase) &&
                    !line.StartsWith("Department:", StringComparison.OrdinalIgnoreCase))
                {
                    var machMatch = Regex.Match(line, @"(?:Operation Code\s*/\s*Machine:|Machine:)\s*(\S+)", RegexOptions.IgnoreCase);
                    if (machMatch.Success)
                        currentOp.Machine = machMatch.Groups[1].Value.Trim();
                    continue;
                }
                // ======================================================

                if (line.StartsWith("Scheduled Start:", StringComparison.OrdinalIgnoreCase))
                {
                    currentOp.ScheduledStart = ExtractInline(line, "Scheduled Start:");
                    continue;
                }

                if (line.StartsWith("Scheduled Finish:", StringComparison.OrdinalIgnoreCase))
                {
                    currentOp.ScheduledFinish = ExtractInline(line, "Scheduled Finish:");
                    continue;
                }

                if (line.StartsWith("NOTE", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("WF ID#", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("STD ROUTING", StringComparison.OrdinalIgnoreCase))
                {
                    inWorkInstruction = true;
                    inMaterials       = false;
                    currentOp.WorkInstructions.Add(line);
                    continue;
                }

                if (line.StartsWith("Requirements", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("Component Item", StringComparison.OrdinalIgnoreCase))
                {
                    inMaterials       = true;
                    inWorkInstruction = false;
                    continue;
                }

                if (line.StartsWith("Resource Seq", StringComparison.OrdinalIgnoreCase))
                {
                    inWorkInstruction = false;
                    inMaterials       = false;
                    continue;
                }

                if (inWorkInstruction && line.Length > 3)
                {
                    currentOp.WorkInstructions.Add(line);
                    continue;
                }

                if (inMaterials && line.Length > 3)
                {
                    currentOp.Materials.Add(line);
                    continue;
                }
            }

            if (currentOp != null) ops.Add(currentOp);

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