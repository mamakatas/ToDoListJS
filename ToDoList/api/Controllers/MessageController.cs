using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoList.Business.Dtos;
using ToDoList.Business.Interfaces;
using ToDoList.Data;
using ToDoList.Dtos;
using ToDoList.Interfaces;
using ToDoList.Mapper;
using ToDoList.Models;
using ToDoList.Business.Mapper;
namespace ToDoList.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMessageRepository _messageRepository;
        private readonly ITaskRepository _taskRepository;

        public MessageController(UserManager<AppUser> userManager, IMessageRepository messageRepository, ITaskRepository taskRepository)
        {
            _userManager = userManager;
            _messageRepository = messageRepository;
            _taskRepository = taskRepository;
        }

        [HttpGet("get-all")]
        [Authorize]
        public async Task<List<MessageDto>> GetAllMessages()
        {
            var messages = await _messageRepository.GetAllMessages();
            return messages.Select(MessageMapper.MapToDto).ToList();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetMessageById(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var message = await _messageRepository.GetMessageById(id);
            if (message == null)
            {
                return NotFound("Message not found");
            }

            var messageDto = MessageMapper.MapToDto(message);
            return Ok(messageDto);
        }



        [HttpPut("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> UpdateMessage(int id, [FromBody] CreateMessageDto updateMessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingMessage = await _messageRepository.GetMessageById(id);
            if (existingMessage == null)
            {
                return NotFound("Message not found");
            }

            var updatedMessage = await _messageRepository.UpdateMessageAsync(id, updateMessage);
            if (updatedMessage == null)
            {
                return BadRequest("Failed to update message");
            }

            var messageDto = MessageMapper.MapToDto(updatedMessage);
            return Ok(messageDto);
        }
        [HttpPost("respond/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RespondToMessage(int id, [FromBody] ResponseMessageDto responseMessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingMessage = await _messageRepository.GetMessageById(id);
            if (existingMessage == null)
            {
                return NotFound("Message not found");
            }

            var updatedMessage = await _messageRepository.RespondToMessageAsync(id, responseMessage);
            if (updatedMessage == null)
            {
                return BadRequest("Failed to respond to message");
            }

            var messageDto = MessageMapper.MapToDto(updatedMessage);
            return Ok(messageDto);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingMessage = await _messageRepository.GetMessageById(id);
            if (existingMessage == null)
            {
                return NotFound("Message not found");
            }

            var result = await _messageRepository.DeleteMessageAsync(id);
            if (!result)
            {
                return BadRequest("Failed to delete message");
            }

            return NoContent();
        }

    }
}