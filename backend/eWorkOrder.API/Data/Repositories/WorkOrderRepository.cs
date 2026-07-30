using Microsoft.EntityFrameworkCore;
using eWorkOrder.API.Data.Entities;
using eWorkOrder.API.Models.Responses; // Tambahkan using ini

namespace eWorkOrder.API.Data.Repositories
{
    public class WorkOrderRepository
    {
        private readonly AppDbContext _db;

        public WorkOrderRepository(AppDbContext db)
        {
            _db = db;
        }

        // Dashboard summary
        public async Task<DashboardData> GetDashboardDataAsync()
        {
            var totalWO   = await _db.WorkOrders.CountAsync();
            var released  = await _db.WorkOrders.CountAsync(w => w.WoStatus == "Released");
            var closed    = await _db.WorkOrders.CountAsync(w => w.WoStatus == "Closed");
            var failed    = await _db.WorkOrders.CountAsync(w => w.WoStatus == "Failed Close");
            var complete  = await _db.WorkOrders.CountAsync(w => w.WoStatus != null && w.WoStatus.Contains("Complete"));

            var importedRows   = await _db.OperationEmployees.CountAsync();
            var uniqueOps      = await _db.Operations.Select(o => o.OperationNum).Distinct().CountAsync();
            var totalDepts     = await _db.Operations.Select(o => o.DepartmentCode).Distinct().CountAsync();

            var notStarted = await _db.Operations.CountAsync(o => o.OpStatus == "NOT STARTED");
            var inProgress = await _db.Operations.CountAsync(o => o.OpStatus == "IN PROGRESS");
            var completed  = await _db.Operations.CountAsync(o => o.OpStatus == "COMPLETED");

            var departments = await _db.Operations
                .Where(o => o.DepartmentCode != null)
                .GroupBy(o => o.DepartmentCode)
                .Select(g => new DeptData
                {
                    Code           = g.Key!,
                    OperationCount = g.Count(),
                    EmployeeCount  = g.SelectMany(o => o.Employees).Select(e => e.EmployeeId).Distinct().Count()
                })
                .OrderByDescending(d => d.OperationCount)
                .ToListAsync();

            return new DashboardData
            {
                TotalWO          = totalWO,
                Released         = released,
                Closed           = closed,
                Failed           = failed,
                Complete         = complete,
                ImportedRows     = importedRows,
                UniqueOperations = uniqueOps,
                TotalDepartments = totalDepts,
                OpNotStarted     = notStarted,
                OpInProgress     = inProgress,
                OpCompleted      = completed,
                Departments      = departments,
            };
        }

        // WO List dengan filter & pagination
        public async Task<(int total, List<WorkOrderEntity> data)> GetWorkOrdersAsync(
            string? search, string? status, string? department,
            int page, int pageSize)
        {
            var query = _db.WorkOrders
                .Include(w => w.Operations)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(w =>
                    w.WoNumber!.Contains(search) ||
                    w.Description!.Contains(search));

            if (!string.IsNullOrEmpty(status))
                query = query.Where(w => w.WoStatus == status);

            if (!string.IsNullOrEmpty(department))
                query = query.Where(w =>
                    w.Operations.Any(o => o.DepartmentCode == department.ToUpper()));

            var total = await query.CountAsync();
            var data  = await query
                .OrderBy(w => w.WoNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (total, data);
        }

        // WO Detail lengkap
        public async Task<WorkOrderEntity?> GetWorkOrderDetailAsync(string woNumber)
        {
            return await _db.WorkOrders
                .Include(w => w.Operations)
                    .ThenInclude(o => o.Employees)
                .Include(w => w.Operations)
                    .ThenInclude(o => o.WorkInstructions)
                .Include(w => w.Operations)
                    .ThenInclude(o => o.Materials)
                .Include(w => w.Operations)
                    .ThenInclude(o => o.Resources)
                .Include(w => w.Operations)
                    .ThenInclude(o => o.Notes)
                .FirstOrDefaultAsync(w => w.WoNumber == woNumber);
        }

        // Operation Detail
        public async Task<OperationDetailDto?> GetOperationDetailAsync(string woNumber, string operationNum)
        {
            var op = await _db.Operations
                .Include(o => o.WorkOrder)
                .Include(o => o.WorkInstructions.OrderBy(w => w.SeqNo))
                .Include(o => o.Materials)
                .Include(o => o.Employees)
                .Include(o => o.Notes.OrderByDescending(n => n.CreatedAt))
                .FirstOrDefaultAsync(o =>
                    o.WorkOrder!.WoNumber == woNumber &&
                    o.OperationNum == operationNum);

            if (op == null) return null;

            return new OperationDetailDto
            {
                OperationNum    = op.OperationNum,
                Description     = op.Description,
                Status          = op.OpStatus,
                Department      = op.DepartmentCode,
                Machine         = op.MachineCode,
                BarcodeValue    = op.BarcodeValue,
                ScheduledStart  = op.ScheduledStart?.ToString("dd MMM yyyy HH:mm"),
                ScheduledFinish = op.ScheduledFinish?.ToString("dd MMM yyyy HH:mm"),
                ReviewedBy      = op.ReviewedBy,
                ReviewedAt      = op.ReviewedAt?.ToString("dd MMM yyyy HH:mm"),
                WorkInstructions = op.WorkInstructions.Select(w => new WorkInstructionDto
                {
                    SeqNo           = w.SeqNo,
                    InstructionText = w.InstructionText,
                    InspectType     = w.InspectType,
                    WfId            = w.WfId,
                    Scope           = w.Scope,
                }).ToList(),
                Materials = op.Materials.Select(m => new MaterialDto
                {
                    ComponentItem = m.ComponentItem,
                    Description   = m.Description,
                    SupplyType    = m.SupplyType,
                    DateRequired  = m.DateRequired?.ToString("dd MMM yyyy"),
                    Uom           = m.Uom,
                    RequiredQty   = m.RequiredQty,
                }).ToList(),
                Employees = op.Employees.Select(e => new EmployeeDto
                {
                    EmployeeId   = e.EmployeeId,
                    EmployeeName = e.EmployeeName,
                    ClockIn      = e.ClockIn?.ToString("dd/MM/yyyy HH:mm"),
                    ClockOut     = e.ClockOut?.ToString("dd/MM/yyyy HH:mm"),
                    StdHours     = e.StdHours,
                    ActHours     = e.ActHours,
                }).ToList(),
                Notes = op.Notes.Select(n => new NoteDto
                {
                    NoteText   = n.NoteText,
                    AuthorName = n.AuthorName,
                    AuthorDept = n.AuthorDept,
                    CreatedAt  = n.CreatedAt.ToString("dd MMM yyyy HH:mm"),
                }).ToList(),
            };
        }

        public async Task<NoteDto?> CreateNoteAsync(string woNumber, string operationNum, string noteText, string authorName, string authorDept)
        {
            var op = await _db.Operations
                .Include(o => o.WorkOrder)
                .FirstOrDefaultAsync(o => o.WorkOrder!.WoNumber == woNumber && o.OperationNum == operationNum);

            if (op == null) return null;

            var note = new NoteEntity
            {
                OperationId = op.Id,
                NoteText    = noteText,
                AuthorName  = authorName,
                AuthorDept  = authorDept,
                CreatedAt   = DateTime.Now,
            };

            _db.Notes.Add(note);
            await _db.SaveChangesAsync();

            return new NoteDto
            {
                NoteText   = note.NoteText,
                AuthorName = note.AuthorName,
                AuthorDept = note.AuthorDept,
                CreatedAt  = note.CreatedAt.ToString("dd MMM yyyy HH:mm"),
            };
        }
    }

    // Helper classes
    public class DashboardData
    {
        public int TotalWO          { get; set; }
        public int Released         { get; set; }
        public int Closed           { get; set; }
        public int Failed           { get; set; }
        public int Complete         { get; set; }
        public int ImportedRows     { get; set; }
        public int UniqueOperations { get; set; }
        public int TotalDepartments { get; set; }
        public int OpNotStarted     { get; set; }
        public int OpInProgress     { get; set; }
        public int OpCompleted      { get; set; }
        public List<DeptData> Departments { get; set; } = new();
    }

    public class DeptData
    {
        public string Code           { get; set; } = "";
        public int    OperationCount { get; set; }
        public int    EmployeeCount  { get; set; }
    }
}