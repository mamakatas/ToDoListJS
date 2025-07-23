using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using ToDoList.Business.Dtos;
using ToDoList.Models;

namespace ToDoList.Business.Mapper
{
    public static class MessageMapper
    {
        public static Messages MapToModel(this CreateMessageDto createDto)
        {
            return new Messages
            {
                Content = createDto.Content,
                Response = string.Empty
            };
        }

        public static MessageDto MapToDto(Messages message)
        {
            return new MessageDto
            {
                Id = message.Id,
                TaskId = message.TasksId,
                AppUserId = message.AppUserId,
                Content = message.Content,
                Response = message.Response
            };
        }
    }
}