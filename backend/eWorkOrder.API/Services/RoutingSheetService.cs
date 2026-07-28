using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
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
            var fullText = new List<string>();

            using var pdf = PdfDocument.Open(stream.ToArray());

            foreach (var page in pdf.GetPages())
            {
                // Ambil semua words, sort by Y descending (top to bottom), then X
                var words = page.GetWords()
                    .OrderByDescending(w => w.BoundingBox.Bottom)
                    .ThenBy(w => w.BoundingBox.Left)
                    .ToList();

                // Group by Y position (same line = Y within 3px)
                var lines = new List<string>();
                var currentY = double.MaxValue;
                var currentLine = new List<string>();

                foreach (var word in words)
                {
                    if (Math.Abs(word.BoundingBox.Bottom - currentY) > 3)
                    {
                        if (currentLine.Any())
                            lines.Add(string.Join(" ", currentLine));
                        currentLine = new List<string> { word.Text };
                        currentY = word.BoundingBox.Bottom;
                    }
                    else
                    {
                        currentLine.Add(word.Text);
                    }
                }
                if (currentLine.Any())
                    lines.Add(string.Join(" ", currentLine));

                fullText.AddRange(lines);
            }

            // Parse header
            result.JobNo           = ExtractValue(fullText, @"Job No[:\s]+(\S+)");
            result.Quantity        = ExtractValue(fullText, @"Qty[:\s]+(\S+)");
            result.SerialNo        = ExtractValue(fullText, @"Serial No[:\s]+(\S+)");
            result.BarcodeJobNo    = result.JobNo;
            result.BarcodeAssembly = ExtractValue(fullText, @"Assembly[:\s]+(\S+)");
            result.SalesOrder      = ExtractValue(fullText, @"Sales\s+Order[:\s]+(\S+)");

            // Parse Item Description
            var descIdx = fullText.FindIndex(l => l.Contains("Item Description:"));
            if (descIdx >= 0)
            {
                var descLine = fullText[descIdx];
                var afterColon = descLine.Contains(":") 
                    ? descLine.Substring(descLine.IndexOf("Item Description:") + 17).Trim()
                    : "";
                result.ItemDescription = afterColon.Split(new[]{"Qty:","Bill"}, StringSplitOptions.None)[0].Trim();
            }

            // Parse operations
            result.Operations = ParseOperations(fullText);

            _logger.LogInformation("Parsed {Count} operations from PDF: {JobNo}", 
                result.Operations.Count, result.JobNo);

            foreach (var op in result.Operations)
            {
                _logger.LogInformation("  Op {No}: Desc={Desc}, Dept={Dept}, Machine={Machine}",
                    op.OperationNo, op.OperationDescription, op.Department, op.Machine);
            }

            return result;
        }

        private List<RoutingOpDto> ParseOperations(List<string> lines)
        {
            var ops     = new List<RoutingOpDto>();
            var opRegex = new Regex(@"^Operation\s+No\s*[:\s]+(\d+)$", RegexOptions.IgnoreCase);
            var opDescRegex = new Regex(@"Operation\s+Description[:\s]+(.+)", RegexOptions.IgnoreCase);
            var deptRegex   = new Regex(@"^Department[:\s]+(\w+)", RegexOptions.IgnoreCase);
            var machRegex   = new Regex(@"Operation\s+Code\s*/\s*Machine[:\s]+(\S+)", RegexOptions.IgnoreCase);
            var schedStartRegex  = new Regex(@"Scheduled\s+Start[:\s]+(.+)", RegexOptions.IgnoreCase);
            var schedFinishRegex = new Regex(@"Scheduled\s+Finish[:\s]+(.+)", RegexOptions.IgnoreCase);

            RoutingOpDto? currentOp   = null;
            bool inWorkInstruction    = false;
            bool inMaterials          = false;

            for (int i = 0; i < lines.Count; i++)
            {
                var line = lines[i].Trim();
                if (string.IsNullOrWhiteSpace(line)) continue;

                // Detect new operation
                var opMatch = opRegex.Match(line);
                if (opMatch.Success)
                {
                    if (currentOp != null) ops.Add(currentOp);
                    currentOp = new RoutingOpDto
                    {
                        OperationNo  = opMatch.Groups[1].Value,
                        BarcodeValue = opMatch.Groups[1].Value,
                    };
                    inWorkInstruction = false;
                    inMaterials       = false;
                    continue;
                }

                if (currentOp == null) continue;

                // Operation Description
                var descMatch = opDescRegex.Match(line);
                if (descMatch.Success && string.IsNullOrEmpty(currentOp.OperationDescription))
                {
                    currentOp.OperationDescription = descMatch.Groups[1].Value
                        .Split(new[]{"Scheduled"}, StringSplitOptions.None)[0].Trim();
                    continue;
                }

                // Department
                var deptMatch = deptRegex.Match(line);
                if (deptMatch.Success && string.IsNullOrEmpty(currentOp.Department))
                {
                    currentOp.Department = deptMatch.Groups[1].Value.Trim();

                    // Machine might be on same line
                    var machOnSame = machRegex.Match(line);
                    if (machOnSame.Success)
                        currentOp.Machine = machOnSame.Groups[1].Value.Trim();
                    continue;
                }

                // Machine (separate line)
                var machMatch = machRegex.Match(line);
                if (machMatch.Success && string.IsNullOrEmpty(currentOp.Machine))
                {
                    currentOp.Machine = machMatch.Groups[1].Value.Trim();
                    continue;
                }

                // Scheduled Start
                var schedStartMatch = schedStartRegex.Match(line);
                if (schedStartMatch.Success && string.IsNullOrEmpty(currentOp.ScheduledStart))
                {
                    currentOp.ScheduledStart = schedStartMatch.Groups[1].Value
                        .Split(new[]{"Scheduled","00:00"}, StringSplitOptions.None)[0].Trim();
                    continue;
                }

                // Scheduled Finish
                var schedFinishMatch = schedFinishRegex.Match(line);
                if (schedFinishMatch.Success && string.IsNullOrEmpty(currentOp.ScheduledFinish))
                {
                    currentOp.ScheduledFinish = schedFinishMatch.Groups[1].Value
                        .Split(new[]{"00:00"}, StringSplitOptions.None)[0].Trim();
                    continue;
                }

                // Work instructions triggers
                if (line.StartsWith("WF ID", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("NOTE", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("PER ", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("- ", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("* ", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("> ", StringComparison.OrdinalIgnoreCase) ||
                    (line.StartsWith("S/O", StringComparison.OrdinalIgnoreCase)) ||
                    line.StartsWith("Scope", StringComparison.OrdinalIgnoreCase))
                {
                    inWorkInstruction = true;
                    inMaterials       = false;
                }

                // Materials section
                if (line.StartsWith("Requirements", StringComparison.OrdinalIgnoreCase) ||
                    line.StartsWith("Component Item", StringComparison.OrdinalIgnoreCase))
                {
                    inMaterials       = true;
                    inWorkInstruction = false;
                    continue;
                }

                // Stop collecting at Resource Seq
                if (line.StartsWith("Resource Seq", StringComparison.OrdinalIgnoreCase))
                {
                    inWorkInstruction = false;
                    inMaterials       = false;
                    continue;
                }

                // Skip header/footer lines
                if (line.Contains("MES Routing Sheet") ||
                    line.Contains("Page ") ||
                    line.Contains("Printed By") ||
                    line.Contains("IO ID BTM"))
                    continue;

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

        private string? ExtractValue(List<string> lines, string pattern)
        {
            var regex = new Regex(pattern, RegexOptions.IgnoreCase);
            foreach (var line in lines)
            {
                var match = regex.Match(line);
                if (match.Success) return match.Groups[1].Value.Trim();
            }
            return null;
        }
    }
}