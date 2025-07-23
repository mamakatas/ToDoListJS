using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoList.Business.Dtos;
using ToDoList.Models;
using ToDoList.Business.Mapper;

namespace ToDoList.Mapper
{
    public static class TaskMapper
    {
        public static Models.Tasks MapToModel(Dtos.CreateTaskDto createTaskDto)
        {
            return new Models.Tasks
            {
                Name = createTaskDto.Name,
                Description = createTaskDto.Description,
                DueDate = createTaskDto.DueDate,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static TaskDto MapToDto(Tasks task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Name = task.Name,
                Description = task.Description,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt,
                DueDate = task.DueDate,
                UserId = task.UserId,
                Status = (int)task.Status,
                StatusDescription = task.StatusDescription,
                Messages = task.Messages?.Select(m => MessageMapper.MapToDto(m)).ToList() ?? new List<MessageDto>()
            };
        }
    }
}