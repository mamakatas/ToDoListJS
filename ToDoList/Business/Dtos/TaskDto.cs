using System;
using System.Collections.Generic;

namespace ToDoList.Business.Dtos
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public string? UserId { get; set; }
        public List<MessageDto> Messages { get; set; }
        public string StatusDescription { get; set; }
        public int Status { get; set; }
    }
} 