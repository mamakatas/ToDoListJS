using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoList.Dtos
{
    public class RegisterDto
    {
        public string UserName { get; set; }
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        public string Password { get; set; }
    }

}