using System;

namespace ToDoList.Business.Dtos
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string AppUserId { get; set; }
        public string Content { get; set; }
        public string Response { get; set; }
    }
} 