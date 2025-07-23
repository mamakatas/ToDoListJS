using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoList.Models
{
    public class Tasks
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TasksStatus Status { get; set; }
        public string StatusDescription
        {
            get
            {
                return Status switch
                {
                    TasksStatus.NotStarted => "Haven't Started",
                    TasksStatus.InProgress => "In Progress",
                    TasksStatus.Completed => "Completed",
                    _ => "Unknown"
                };
            }
        }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? DueDate { get; set; }

        public string? UserId { get; set; }
        public List<Messages> Messages { get; set; } = new List<Messages>();
    }
    
    public enum TasksStatus
{
    [Display(Name = "Haven't Started")]
    NotStarted = 1,  // Yapılmadı
    [Display(Name = "In Progress")]
    InProgress = 2,  // Yapılıyor
    [Display(Name = "Completed")]
    Completed = 3    // Yapıldı
}

}