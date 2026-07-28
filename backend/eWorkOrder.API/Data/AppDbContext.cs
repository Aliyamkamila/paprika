using Microsoft.EntityFrameworkCore;
using eWorkOrder.API.Data.Entities;

namespace eWorkOrder.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<WorkOrderEntity>          WorkOrders          { get; set; }
        public DbSet<OperationEntity>          Operations          { get; set; }
        public DbSet<OperationEmployeeEntity>  OperationEmployees  { get; set; }
        public DbSet<WorkInstructionEntity>    WorkInstructions    { get; set; }
        public DbSet<OperationMaterialEntity>  OperationMaterials  { get; set; }
        public DbSet<OperationResourceEntity>  OperationResources  { get; set; }
        public DbSet<NoteEntity>               Notes               { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WorkOrderEntity>()
                .HasIndex(w => w.WoNumber)
                .IsUnique();

            modelBuilder.Entity<OperationEntity>()
                .HasOne(o => o.WorkOrder)
                .WithMany(w => w.Operations)
                .HasForeignKey(o => o.WoId);
        }
    }
}