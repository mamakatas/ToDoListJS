using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoList.Models
{
    public class Messages
    {
        public int Id { get; set; }
        public string Content { get; set; }

        public Tasks? Tasks { get; set; }
        public int TasksId { get; set; }

        public AppUser? AppUser { get; set; }
        public string? AppUserId { get; set; }
        public string Response { get; set; } = string.Empty;

    }
}