using Enhabit.Models;
using System;

namespace Enhabit.Repository.Contracts
{
    public interface IUserRepository
    {
        Guid LoginUser(User user);

        Guid CreateUser(User user);

        bool DeleteUser(User user);

        bool UpdateUser(User user);
    }
}
