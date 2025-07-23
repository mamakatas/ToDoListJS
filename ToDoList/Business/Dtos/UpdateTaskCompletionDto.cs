using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ToDoList.Models;

namespace ToDoList.Dtos
{
    public class UpdateTaskCompletionDto
    {
        public TasksStatus Status { get; set; }
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }

}