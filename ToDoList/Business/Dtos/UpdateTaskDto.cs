using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ToDoList.Models;

namespace ToDoList.Dtos
{
    public class UpdateTaskDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
        public TasksStatus Status { get; set; }
    }

}