using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ToDoList.Models;

namespace ToDoList.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<Messages> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Tasks>().ToTable("Tasks");
            modelBuilder.Entity<Messages>().ToTable("Messages");
            modelBuilder.Entity<Tasks>()
                .HasMany(t => t.Messages)
                .WithOne(m => m.Tasks)
                .HasForeignKey(m => m.TasksId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        
    }
}