using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eWorkOrder.API.Data.Entities
{
    [Table("operation_work_instructions")]
    public class WorkInstructionEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("operation_id")]
        public int OperationId { get; set; }

        [Column("seq_no")]
        public int? SeqNo { get; set; }

        [Column("instruction_text")]
        public string? InstructionText { get; set; }

        [Column("inspect_type")]
        public string? InspectType { get; set; }

        [Column("wf_id")]
        public string? WfId { get; set; }

        [Column("scope")]
        public string? Scope { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("OperationId")]
        public OperationEntity? Operation { get; set; }
    }
}