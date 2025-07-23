using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ToDoList.Business.Dtos;
using ToDoList.Business.Interfaces;
using ToDoList.Data;
using ToDoList.Data.DataAccess;
using ToDoList.Models;

namespace ToDoList.Business.Repositories
{
    public class MessagesRepository : IMessageRepository
    {
        private readonly IMessagesDal _messagesDal;

        public MessagesRepository(IMessagesDal messagesDal)
        {
            _messagesDal = messagesDal;
        }

        public async Task<List<Messages>> GetAllMessages()
        {
            return await _messagesDal.GetAllMessages();
        }
        public async Task<Messages> GetMessageById(int id)
        {
            return await _messagesDal.GetMessageById(id);
        }

        public async Task<List<Messages>> GetMessageByTaskId(int taskId)
        {
            return await _messagesDal.GetMessageByTaskId(taskId);
        }

        public async Task<Messages> UpdateMessageAsync(int id, CreateMessageDto createMessage)
        {
            return await _messagesDal.UpdateMessageAsync(id, createMessage);
        }

        public async Task<bool> DeleteMessageAsync(int id)
        {
            return await _messagesDal.DeleteMessageAsync(id);
        }

        public async Task<Messages> RespondToMessageAsync(int id, ResponseMessageDto responseMessage)
        {
            return await _messagesDal.RespondToMessageAsync(id, responseMessage);
        }


        public async Task AddMessageToTaskAsync(int taskId, string content, string appUserId)
        {
            await _messagesDal.AddMessageToTaskAsync(taskId, content, appUserId);
        }
    
    }
}