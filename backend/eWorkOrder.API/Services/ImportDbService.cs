using Microsoft.EntityFrameworkCore;
using eWorkOrder.API.Data;
using eWorkOrder.API.Data.Entities;
using eWorkOrder.API.Models.DTOs;

namespace eWorkOrder.API.Services
{
    public class ImportDbService
    {
        private readonly AppDbContext _db;
        private readonly ILogger<ImportDbService> _logger;

        public ImportDbService(AppDbContext db, ILogger<ImportDbService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<(int inserted, int updated)> SaveToDbAsync(List<ExcelRowDto> rows)
        {
            int inserted = 0;
            int updated  = 0;

            // Group by WO Number
            var grouped = rows
                .GroupBy(r => r.WoNumber?.Trim())
                .Where(g => !string.IsNullOrEmpty(g.Key))
                .ToList();

            _logger.LogInformation("Saving {Count} WOs to DB...", grouped.Count);

            foreach (var woGroup in grouped)
            {
                var woNumber = woGroup.Key!;
                var firstRow = woGroup.First();

                // Cek WO sudah ada atau belum
                var existingWo = await _db.WorkOrders
                    .FirstOrDefaultAsync(w => w.WoNumber == woNumber);

                WorkOrderEntity wo;

                if (existingWo == null)
                {
                    wo = new WorkOrderEntity
                    {
                        WoNumber    = woNumber,
                        Description = firstRow.Description?.Trim(),
                        Quantity    = firstRow.Quantity,
                        WoStatus    = firstRow.WoStatus?.Trim(),
                        PlannerCode = firstRow.ResourceCode?.Trim(),
                        ScheduledStart  = woGroup.Min(r => r.ClockIn),
                        ScheduledFinish = woGroup.Max(r => r.ClockOut),
                        CreatedAt   = DateTime.Now,
                        UpdatedAt   = DateTime.Now,
                    };
                    _db.WorkOrders.Add(wo);
                    await _db.SaveChangesAsync();
                    inserted++;
                }
                else
                {
                    // Update status & dates
                    existingWo.WoStatus       = firstRow.WoStatus?.Trim();
                    existingWo.ScheduledStart  = woGroup.Min(r => r.ClockIn);
                    existingWo.ScheduledFinish = woGroup.Max(r => r.ClockOut);
                    existingWo.UpdatedAt       = DateTime.Now;
                    wo = existingWo;
                    updated++;
                }

                // Group operations per WO
                var opGroups = woGroup
                    .GroupBy(r => r.OperationNum?.Trim())
                    .Where(g => !string.IsNullOrEmpty(g.Key));

                foreach (var opGroup in opGroups)
                {
                    var opNum    = opGroup.Key!;
                    var firstOp  = opGroup.OrderByDescending(r => r.ClockOut).First();

                    // Cek operation sudah ada
                    var existingOp = await _db.Operations
                        .FirstOrDefaultAsync(o => o.WoId == wo.Id && o.OperationNum == opNum);

                    OperationEntity op;

                    if (existingOp == null)
                    {
                        op = new OperationEntity
                        {
                            WoId           = wo.Id,
                            OperationNum   = opNum,
                            Description    = firstOp.OpDescription?.Trim(),
                            OpStatus       = firstOp.OpStatus?.Trim(),
                            DepartmentCode = firstOp.DepartmentCode?.Trim(),
                            MachineCode    = firstOp.MachineCode?.Trim(),
                            ResourceCode   = firstOp.ResourceCode?.Trim(),
                            CreatedAt      = DateTime.Now,
                            UpdatedAt      = DateTime.Now,
                        };
                        _db.Operations.Add(op);
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        existingOp.OpStatus    = firstOp.OpStatus?.Trim();
                        existingOp.UpdatedAt   = DateTime.Now;
                        op = existingOp;
                    }

                    // Hapus employees lama lalu insert ulang
                    var oldEmployees = _db.OperationEmployees
                        .Where(e => e.OperationId == op.Id);
                    _db.OperationEmployees.RemoveRange(oldEmployees);

                    // Insert employees
                    foreach (var row in opGroup)
                    {
                        if (string.IsNullOrEmpty(row.EmployeeId)) continue;

                        _db.OperationEmployees.Add(new OperationEmployeeEntity
                        {
                            OperationId  = op.Id,
                            EmployeeId   = row.EmployeeId?.Trim(),
                            EmployeeName = row.EmployeeName?.Trim(),
                            ClockIn      = row.ClockIn,
                            ClockOut     = row.ClockOut,
                            StdHours     = row.StdHours,
                            ActHours     = row.ActHours,
                            CreatedAt    = DateTime.Now,
                        });
                    }
                }

                await _db.SaveChangesAsync();
            }

            _logger.LogInformation("Done! Inserted: {I}, Updated: {U}", inserted, updated);
            return (inserted, updated);
        }
    }
}