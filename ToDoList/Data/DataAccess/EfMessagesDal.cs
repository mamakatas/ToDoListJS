using Microsoft.EntityFrameworkCore;
using ToDoList.Models;
using ToDoList.Business.Dtos;

namespace ToDoList.Data.DataAccess
{
    public class EfMessagesDal : IMessagesDal
    {
        private readonly ApplicationDbContext _context;

        public EfMessagesDal(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Messages>> GetAllMessages()
        {
            return await _context.Messages.ToListAsync();
        }

        public async Task<Messages> GetMessageById(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<List<Messages>> GetMessageByTaskId(int taskId)
        {
            return await _context.Messages.Where(m => m.TasksId == taskId).ToListAsync();
        }

        public async Task<Messages> UpdateMessageAsync(int id, CreateMessageDto createMessage)
        {
            var existingMessage = await GetMessageById(id);
            if (existingMessage == null) return null;

            existingMessage.Content = createMessage.Content;

            _context.Messages.Update(existingMessage);
            await _context.SaveChangesAsync();
            return existingMessage;
        }

        public async Task<bool> DeleteMessageAsync(int id)
        {
            var message = await GetMessageById(id);
            if (message == null) return false;

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Messages> RespondToMessageAsync(int id, ResponseMessageDto responseMessage)
        {
            var existingMessage = await _context.Messages.FindAsync(id);
            if (existingMessage == null) return null;

            existingMessage.Response = responseMessage.Response;

            _context.Messages.Update(existingMessage);
            await _context.SaveChangesAsync();
            return existingMessage;
        }

        public async Task AddMessageToTaskAsync(int taskId, string content, string appUserId)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == taskId);
            if (task == null)
            {
                throw new Exception("Task not found");
            }

            var message = new Messages
            {
                Content = content,
                TasksId = taskId,
                AppUserId = appUserId
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
        }
    }
}