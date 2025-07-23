using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoList.Models;
using ToDoList.Business.Dtos;

namespace ToDoList.Data.DataAccess
{
    public interface IMessagesDal
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