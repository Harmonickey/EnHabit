﻿using System;

namespace Enhabit.ViewModels
{
    public class UserViewModel
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public int AccountTypeId { get; set; }
    }
}
