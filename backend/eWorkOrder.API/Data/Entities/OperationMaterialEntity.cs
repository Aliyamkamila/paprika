using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eWorkOrder.API.Data.Entities
{
    [Table("operation_materials")]
    public class OperationMaterialEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("operation_id")]
        public int OperationId { get; set; }

        [Column("component_item")]
        public string? ComponentItem { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("supply_type")]
        public string? SupplyType { get; set; }

        [Column("date_required")]
        public DateTime? DateRequired { get; set; }

        [Column("uom")]
        public string? Uom { get; set; }

        [Column("required_qty")]
        public decimal? RequiredQty { get; set; }

        [Column("comments")]
        public string? Comments { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("OperationId")]
        public OperationEntity? Operation { get; set; }
    }
}