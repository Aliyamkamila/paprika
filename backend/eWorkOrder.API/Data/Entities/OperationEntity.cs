using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eWorkOrder.API.Data.Entities
{
    [Table("operations")]
    public class OperationEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("wo_id")]
        public int WoId { get; set; }

        [Column("operation_num")]
        public string? OperationNum { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("op_status")]
        public string? OpStatus { get; set; }

        [Column("department_code")]
        public string? DepartmentCode { get; set; }

        [Column("machine_code")]
        public string? MachineCode { get; set; }

        [Column("resource_code")]
        public string? ResourceCode { get; set; }

        [Column("scheduled_start")]
        public DateTime? ScheduledStart { get; set; }

        [Column("scheduled_finish")]
        public DateTime? ScheduledFinish { get; set; }

        [Column("barcode_value")]
        public string? BarcodeValue { get; set; }

        [Column("reviewed_by")]
        public string? ReviewedBy { get; set; }

        [Column("reviewed_at")]
        public DateTime? ReviewedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [ForeignKey("WoId")]
        public WorkOrderEntity? WorkOrder { get; set; }

        public ICollection<OperationEmployeeEntity> Employees { get; set; } = new List<OperationEmployeeEntity>();
        public ICollection<WorkInstructionEntity> WorkInstructions { get; set; } = new List<WorkInstructionEntity>();
        public ICollection<OperationMaterialEntity> Materials { get; set; } = new List<OperationMaterialEntity>();
        public ICollection<OperationResourceEntity> Resources { get; set; } = new List<OperationResourceEntity>();
        public ICollection<NoteEntity> Notes { get; set; } = new List<NoteEntity>();
    }
}