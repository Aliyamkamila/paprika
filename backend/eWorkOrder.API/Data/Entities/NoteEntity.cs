using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eWorkOrder.API.Data.Entities
{
    [Table("notes")]
    public class NoteEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("operation_id")]
        public int OperationId { get; set; }

        [Column("note_text")]
        public string? NoteText { get; set; }

        [Column("author_name")]
        public string? AuthorName { get; set; }

        [Column("author_dept")]
        public string? AuthorDept { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("OperationId")]
        public OperationEntity? Operation { get; set; }
    }
}