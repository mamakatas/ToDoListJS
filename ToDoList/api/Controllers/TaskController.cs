using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoList.Business.Interfaces;
using ToDoList.Data;
using ToDoList.Dtos;
using ToDoList.Interfaces;
using ToDoList.Mapper;
using ToDoList.Models;
using ToDoList.Business.Dtos;

namespace ToDoList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITaskRepository _taskRepository;
        private readonly IMessageRepository _message;
        public TaskController(UserManager<AppUser> userManager, ITaskRepository taskRepository, IMessageRepository message)
        {
            _userManager = userManager;
            _taskRepository = taskRepository;
            _message = message;
        }


        [HttpGet("admin-get-all-tasks")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTasks([FromQuery] TaskQuery taskQuery)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tasks = await _taskRepository.GetFilteredTasksAsync(taskQuery);
            var taskDtos = tasks.Select(TaskMapper.MapToDto).ToList();
            return Ok(taskDtos);
        }

        [HttpGet("user-tasks")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetUserTasks([FromQuery] TaskQuery taskQuery)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            var tasks = await _taskRepository.GetFilteredUserTasksAsync(userId, taskQuery);
            var taskDtos = tasks.Select(TaskMapper.MapToDto).ToList();
            return Ok(taskDtos);
        }

        // Get task by id
        [HttpGet("{id}-admin-get-by-id")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskRepository.GetTaskByIdAsync(id);
            if (task == null)
            {
                return NotFound();
            }
            var taskDto = TaskMapper.MapToDto(task);
            return Ok(taskDto);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTask)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }
            var task = await _taskRepository.CreateTaskAsync(createTask, userId);

            return CreatedAtAction(nameof(GetUserTasks), new { id = task.Id }, task);
        }

        // Update task
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto updateTask)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }


            var task = await _taskRepository.UpdateTaskAsync(id, updateTask, userId);
            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        // Update task completion status
        [HttpPut("{id}/completion")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> UpdateTaskCompletion(int id, [FromBody] TasksStatus status)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            var result = await _taskRepository.UpdateTaskCompletionAsync(id, status);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        // Delete task
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }


            var result = await _taskRepository.DeleteTaskAsync(id, userId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPost("{taskId}/messages")]
        public async Task<IActionResult> AddMessageToTask(int taskId, [FromBody] string messageContent)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            await _message.AddMessageToTaskAsync(taskId, messageContent, userId);

            return Ok("Message added successfully.");
        }
        
        [HttpGet("{taskId}/messages")]
        public async Task<IActionResult> GetMessagesForTask(int taskId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }
    
            var messages = await _message.GetMessageByTaskId(taskId);

            return Ok(messages);
        }

    }
}