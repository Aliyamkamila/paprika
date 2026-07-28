using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eWorkOrder.API.Data.Entities
{
    [Table("operation_resources")]
    public class OperationResourceEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("operation_id")]
        public int OperationId { get; set; }

        [Column("seq_no")]
        public int? SeqNo { get; set; }

        [Column("resource_code")]
        public string? ResourceCode { get; set; }

        [Column("usage_rate")]
        public decimal? UsageRate { get; set; }

        [Column("uom")]
        public string? Uom { get; set; }

        [Column("basis")]
        public string? Basis { get; set; }

        [Column("barcode_value")]
        public string? BarcodeValue { get; set; }

        [Column("op_start_stamp")]
        public DateTime? OpStartStamp { get; set; }

        [Column("op_complete_stamp")]
        public DateTime? OpCompleteStamp { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("OperationId")]
        public OperationEntity? Operation { get; set; }
    }
}