using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using ToDoList.Business.Dtos;
using ToDoList.Models;

namespace ToDoList.Business.Interfaces
{
    public interface IMessageRepository
    {
        Task<List<Messages>> GetAllMessages();
        Task<Messages> GetMessageById(int id);
        Task<List<Messages>> GetMessageByTaskId(int taskId);
        Task<Messages> UpdateMessageAsync(int id, CreateMessageDto updateMessage);
        Task<Messages> RespondToMessageAsync(int id, ResponseMessageDto responseMessage);
        Task<bool> DeleteMessageAsync(int id);
        Task AddMessageToTaskAsync(int taskId, string content, string appUserId);
    }
}