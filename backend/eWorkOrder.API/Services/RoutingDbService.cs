using Microsoft.EntityFrameworkCore;
using eWorkOrder.API.Data;
using eWorkOrder.API.Data.Entities;
using eWorkOrder.API.Models.Responses;

namespace eWorkOrder.API.Services
{
    public class RoutingDbService
    {
        private readonly AppDbContext _db;
        private readonly ILogger<RoutingDbService> _logger;

        public RoutingDbService(AppDbContext db, ILogger<RoutingDbService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<(bool Success, string Message)> SaveRoutingAsync(RoutingSheetDto routing)
        {
            try
            {
                // Cari WO di DB berdasarkan Job No
                var wo = await _db.WorkOrders
                    .FirstOrDefaultAsync(w => w.WoNumber == routing.JobNo);

                if (wo == null)
                {
                    // WO belum ada → buat baru
                    wo = new WorkOrderEntity
                    {
                        WoNumber        = routing.JobNo?.Trim(),
                        Description     = routing.ItemDescription?.Trim(),
                        AssemblyNo      = routing.BarcodeAssembly?.Trim(),
                        SerialNo        = routing.SerialNo?.Trim(),
                        SalesOrder      = routing.SalesOrder?.Trim(),
                        ScheduledStart  = ParseDate(routing.ScheduledStart),
                        ScheduledFinish = ParseDate(routing.ScheduledFinish),
                        CreatedAt       = DateTime.Now,
                        UpdatedAt       = DateTime.Now,
                    };
                    _db.WorkOrders.Add(wo);
                    await _db.SaveChangesAsync();
                    _logger.LogInformation("Created new WO: {WoNumber}", wo.WoNumber);
                }
                else
                {
                    // Update info dari PDF
                    wo.AssemblyNo      = routing.BarcodeAssembly?.Trim();
                    wo.SerialNo        = routing.SerialNo?.Trim();
                    wo.SalesOrder      = routing.SalesOrder?.Trim();
                    wo.UpdatedAt       = DateTime.Now;
                }

                await _db.SaveChangesAsync();

                int opsProcessed = 0;

                foreach (var routingOp in routing.Operations)
                {
                    if (string.IsNullOrEmpty(routingOp.OperationNo)) continue;

                    // Cari operation yang match
                    var op = await _db.Operations
                        .FirstOrDefaultAsync(o =>
                            o.WoId == wo.Id &&
                            o.OperationNum == routingOp.OperationNo.Trim());

                    if (op == null)
                    {
                        // Operation belum ada → buat baru
                        op = new OperationEntity
                        {
                            WoId           = wo.Id,
                            OperationNum   = routingOp.OperationNo.Trim(),
                            Description    = routingOp.OperationDescription?.Trim(),
                            DepartmentCode = routingOp.Department?.Trim(),
                            MachineCode    = routingOp.Machine?.Trim(),
                            BarcodeValue   = routingOp.BarcodeValue?.Trim(),
                            ScheduledStart  = ParseDate(routingOp.ScheduledStart),
                            ScheduledFinish = ParseDate(routingOp.ScheduledFinish),
                            CreatedAt      = DateTime.Now,
                            UpdatedAt      = DateTime.Now,
                        };
                        _db.Operations.Add(op);
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        // Update info dari PDF
                        op.Description    = routingOp.OperationDescription?.Trim();
                        op.DepartmentCode = routingOp.Department?.Trim();
                        op.MachineCode    = routingOp.Machine?.Trim();
                        op.BarcodeValue   = routingOp.BarcodeValue?.Trim();
                        op.ScheduledStart  = ParseDate(routingOp.ScheduledStart);
                        op.ScheduledFinish = ParseDate(routingOp.ScheduledFinish);
                        op.UpdatedAt      = DateTime.Now;
                    }

                    // Hapus work instructions lama → insert ulang
                    var oldInstructions = _db.WorkInstructions
                        .Where(w => w.OperationId == op.Id);
                    _db.WorkInstructions.RemoveRange(oldInstructions);

                    // Insert work instructions baru dengan SeqNo
                    int seqNo = 10;
                    foreach (var instruction in routingOp.WorkInstructions)
                    {
                        if (string.IsNullOrWhiteSpace(instruction)) continue;
                        _db.WorkInstructions.Add(new WorkInstructionEntity
                        {
                            OperationId     = op.Id,
                            SeqNo           = seqNo,
                            InstructionText = instruction.Trim(),
                            CreatedAt       = DateTime.Now,
                        });
                        seqNo += 10;
                    }

                    // Hapus materials lama → insert ulang
                    var oldMaterials = _db.OperationMaterials
                        .Where(m => m.OperationId == op.Id);
                    _db.OperationMaterials.RemoveRange(oldMaterials);

                    // Insert materials baru dengan ComponentItem
                    foreach (var mat in routingOp.Materials)
                    {
                        if (string.IsNullOrWhiteSpace(mat)) continue;
                        _db.OperationMaterials.Add(new OperationMaterialEntity
                        {
                            OperationId   = op.Id,
                            ComponentItem = mat.Trim(),
                            Description   = mat.Trim(),
                            CreatedAt     = DateTime.Now,
                        });
                    }

                    await _db.SaveChangesAsync();
                    opsProcessed++;
                }

                _logger.LogInformation(
                    "Routing saved: WO={WoNumber}, Ops={Count}",
                    routing.JobNo, opsProcessed);

                return (true, $"Routing berhasil disimpan! {opsProcessed} operations diproses.");
            }
            catch (Exception ex)
            {
                // Logging lebih detail dengan exception lengkap
                _logger.LogError(ex, "RoutingDbService error: {Message}", ex.Message);
                _logger.LogError("Inner Exception: {Inner}", ex.InnerException?.Message);
                _logger.LogError("Stack Trace: {StackTrace}", ex.StackTrace);
                
                // Log detail routing data jika memungkinkan
                if (routing != null)
                {
                    _logger.LogError("Routing Data - JobNo: {JobNo}, Operations Count: {OpCount}", 
                        routing.JobNo, routing.Operations?.Count ?? 0);
                }
                
                return (false, $"Gagal simpan routing: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        private DateTime? ParseDate(string? value)
        {
            if (string.IsNullOrEmpty(value)) return null;
            return DateTime.TryParse(value, out var d) ? d : null;
        }
    }
}