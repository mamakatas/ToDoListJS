using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoList.Models;
using ToDoList.Business.Dtos;
using ToDoList.Dtos;

namespace ToDoList.Data.DataAccess
{
    public interface ITasksDal 
    {
        Task<Tasks> GetTaskByIdAsync(int id);
        Task<Tasks> CreateTaskAsync(CreateTaskDto taskDto, string userId);
        Task<Tasks> UpdateTaskAsync(int id, UpdateTaskDto taskDto, string userId);
        Task<bool> DeleteTaskAsync(int id, string userId);
        Task<bool> UpdateTaskCompletionAsync(int id, TasksStatus status);
        Task<List<Tasks>> GetFilteredUserTasksAsync(string userId, TaskQuery taskQuery);
        Task<List<Tasks>> GetFilteredTasksAsync(TaskQuery taskQuery);
    }
}