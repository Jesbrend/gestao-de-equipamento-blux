using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EquipmentManagement.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!await context.Users.AnyAsync())
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Name = "Administrador",
                Email = "admin@blux.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Users.Add(adminUser);
        }

        if (!await context.Equipments.AnyAsync())
        {
            var equipments = new List<Equipment>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Notebook Dell XPS 15",
                    Type = "Computador",
                    SerialNumber = "SN-DELL-001",
                    AcquisitionDate = new DateTime(2023, 1, 15),
                    Status = EquipmentStatus.Active,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Monitor LG 27\"",
                    Type = "Monitor",
                    SerialNumber = "SN-LG-002",
                    AcquisitionDate = new DateTime(2023, 3, 20),
                    Status = EquipmentStatus.Active,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Impressora HP LaserJet",
                    Type = "Impressora",
                    SerialNumber = "SN-HP-003",
                    AcquisitionDate = new DateTime(2022, 6, 10),
                    Status = EquipmentStatus.UnderMaintenance,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Switch Cisco 24 Portas",
                    Type = "Rede",
                    SerialNumber = "SN-CISCO-004",
                    AcquisitionDate = new DateTime(2021, 11, 5),
                    Status = EquipmentStatus.Active,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Servidor Dell PowerEdge",
                    Type = "Servidor",
                    SerialNumber = "SN-SRV-005",
                    AcquisitionDate = new DateTime(2020, 8, 22),
                    Status = EquipmentStatus.Inactive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };
            context.Equipments.AddRange(equipments);
        }

        await context.SaveChangesAsync();
    }
}
