using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ToDoList.Data;
using ToDoList.Dtos;
using ToDoList.Models;
using ToDoList.Interfaces;
using ToDoList.Data.DataAccess;

namespace ToDoList.Repositories
{
    public class TasksRepository : ITaskRepository
    {
        private readonly ITasksDal _tasksDal;

        public TasksRepository(ITasksDal tasksDal)
        {
            _tasksDal = tasksDal;
        }

        public async Task<Tasks> CreateTaskAsync(CreateTaskDto taskDto, string user)
        {
            return await _tasksDal.CreateTaskAsync(taskDto, user);
        }

        public async Task<bool> DeleteTaskAsync(int id, string userId)
        {
            return await _tasksDal.DeleteTaskAsync(id, userId);
        }

        public async Task<Tasks> GetTaskByIdAsync(int id)
        {
            return await _tasksDal.GetTaskByIdAsync(id);
        }
        public async Task<List<Tasks>> GetFilteredTasksAsync(TaskQuery taskQuery)
        {
            return await _tasksDal.GetFilteredTasksAsync(taskQuery);
        }

        public async Task<List<Tasks>> GetFilteredUserTasksAsync(string userId, TaskQuery taskQuery)
        {
            return await _tasksDal.GetFilteredUserTasksAsync(userId, taskQuery);
        }


        public async Task<Tasks> UpdateTaskAsync(int id, UpdateTaskDto taskDto, string userId)
        {
            return await _tasksDal.UpdateTaskAsync(id, taskDto, userId);
        }

        public async Task<bool> UpdateTaskCompletionAsync(int id, TasksStatus status)
        {
            return await _tasksDal.UpdateTaskCompletionAsync(id, status);
        }
    }
}
