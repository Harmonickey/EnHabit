using Enhabit.Models;
using Enhabit.Models.Enums;
using System;
using System.Collections.Generic;

namespace Enhabit.Repository.Contracts
{
    public interface IUserRepository
    {
        Guid LoginUser(User user);

        Guid CreateUser(User user);

        IEnumerable<User> GetUsers(AccountType accountType);

        bool DeleteUser(User user);

        bool UpdateUser(User user);
    }
}
