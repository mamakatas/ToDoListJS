using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoList.Models;

namespace ToDoList.Dtos
{
    public class TaskQuery
    {
        public string? TaskName { get; set; } = "";
        public DateTime? DueDate { get; set; }
        public TasksStatus? Status { get; set; }
    }
}   