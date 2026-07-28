using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eWorkOrder.API.Data.Entities
{
    [Table("work_orders")]
    public class WorkOrderEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("wo_number")]
        public string? WoNumber { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("quantity")]
        public int? Quantity { get; set; }

        [Column("uom")]
        public string? Uom { get; set; }

        [Column("wo_status")]
        public string? WoStatus { get; set; }

        [Column("planner_code")]
        public string? PlannerCode { get; set; }

        [Column("assembly_no")]
        public string? AssemblyNo { get; set; }

        [Column("serial_no")]
        public string? SerialNo { get; set; }

        [Column("lot_no")]
        public string? LotNo { get; set; }

        [Column("bill_revision")]
        public string? BillRevision { get; set; }

        [Column("routing_revision")]
        public string? RoutingRevision { get; set; }

        [Column("sales_order")]
        public string? SalesOrder { get; set; }

        [Column("project_no")]
        public string? ProjectNo { get; set; }

        [Column("project_name")]
        public string? ProjectName { get; set; }

        [Column("io_id")]
        public string? IoId { get; set; }

        [Column("scheduled_start")]
        public DateTime? ScheduledStart { get; set; }

        [Column("scheduled_finish")]
        public DateTime? ScheduledFinish { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public ICollection<OperationEntity> Operations { get; set; } = new List<OperationEntity>();
    }
}