using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eWorkOrder.API.Data.Entities
{
    [Table("operation_employees")]
    public class OperationEmployeeEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("operation_id")]
        public int OperationId { get; set; }

        [Column("employee_id")]
        public string? EmployeeId { get; set; }

        [Column("employee_name")]
        public string? EmployeeName { get; set; }

        [Column("clock_in")]
        public DateTime? ClockIn { get; set; }

        [Column("clock_out")]
        public DateTime? ClockOut { get; set; }

        [Column("std_hours")]
        public decimal? StdHours { get; set; }

        [Column("act_hours")]
        public decimal? ActHours { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("OperationId")]
        public OperationEntity? Operation { get; set; }
    }
}