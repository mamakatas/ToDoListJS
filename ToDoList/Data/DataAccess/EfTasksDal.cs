using Microsoft.EntityFrameworkCore;
using ToDoList.Models;
using ToDoList.Business.Dtos;
using ToDoList.Dtos;

namespace ToDoList.Data.DataAccess
{
    public class EfTasksDal : ITasksDal
    {
        private readonly ApplicationDbContext _context;

        public EfTasksDal(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Tasks> CreateTaskAsync(CreateTaskDto taskDto, string user)
        {
            var task = new Tasks
            {
                Name = taskDto.Name,
                Description = taskDto.Description,
                DueDate = taskDto.DueDate,
                CreatedAt = DateTime.UtcNow,
                UserId = user,
                Status = TasksStatus.NotStarted
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> DeleteTaskAsync(int id, string userId)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return false;

            if (task.UserId != userId)
            {
                return false;
            }

            if (task.Status == TasksStatus.InProgress)
            {
                return false;
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Tasks> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Tasks>> GetFilteredTasksAsync(TaskQuery taskQuery)
        {
            var query = _context.Tasks.Include(m => m.Messages).AsQueryable();

            if (!string.IsNullOrEmpty(taskQuery.TaskName))
            {
                query = query.Where(t => t.Name.Contains(taskQuery.TaskName));
            }

            if (taskQuery.DueDate.HasValue)
            {
                query = query.Where(t => t.DueDate == taskQuery.DueDate.Value);
            }

            if (taskQuery.Status.HasValue)
            {
                query = query.Where(t => t.Status == taskQuery.Status.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<List<Tasks>> GetFilteredUserTasksAsync(string userId, TaskQuery taskQuery)
        {
            var query = _context.Tasks.Where(t => t.UserId == userId).AsQueryable();

            if (!string.IsNullOrEmpty(taskQuery.TaskName))
            {
                query = query.Where(t => t.Name.Contains(taskQuery.TaskName));
            }

            if (taskQuery.DueDate.HasValue)
            {
                query = query.Where(t => t.DueDate == taskQuery.DueDate.Value);
            }

            if (taskQuery.Status.HasValue)
            {
                query = query.Where(t => t.Status == taskQuery.Status.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Tasks> UpdateTaskAsync(int id, UpdateTaskDto taskDto, string userId)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return null;

            if (task.UserId != userId)
            {
                return null;
            }

            if (task.Status == TasksStatus.InProgress)
            {
                throw new InvalidOperationException("Cannot update an ongoing task.");
            }

            if (task.Status == TasksStatus.Completed)
            {
                throw new InvalidOperationException("A Completed task can only be deleted.");
            }

            task.Name = taskDto.Name;
            task.Description = taskDto.Description;
            task.DueDate = taskDto.DueDate ?? task.DueDate;
            task.Status = taskDto.Status;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> UpdateTaskCompletionAsync(int id, TasksStatus status)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return false;

            if (task.Status == TasksStatus.InProgress)
            {
                throw new InvalidOperationException("Cannot update an ongoing task.");
            }

            if (task.Status == TasksStatus.Completed)
            {
                throw new InvalidOperationException("A Completed task can only be deleted.");
            }

            task.Status = status;
            task.CompletedAt = status == TasksStatus.Completed ? DateTime.UtcNow : null;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}