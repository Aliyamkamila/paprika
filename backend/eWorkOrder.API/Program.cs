using Microsoft.EntityFrameworkCore;
using eWorkOrder.API.Data;
using eWorkOrder.API.Services;
using eWorkOrder.API.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Tambahkan DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register services
builder.Services.AddSingleton<ExcelReaderService>();

// Tambahkan RoutingSheetService
builder.Services.AddScoped<RoutingSheetService>();  // ← Tambahkan ini

// Ubah dari Singleton menjadi Scoped (karena sekarang pakai DB)
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<WorkOrderService>();

// Tambahkan ImportDbService
builder.Services.AddScoped<ImportDbService>();

// Tambahkan WorkOrderRepository
builder.Services.AddScoped<WorkOrderRepository>();

// Tambahkan RoutingDbService
builder.Services.AddScoped<RoutingDbService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure file upload size limits
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = long.MaxValue;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = long.MaxValue;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();