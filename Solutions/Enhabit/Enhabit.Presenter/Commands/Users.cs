using System;
using Enhabit.Models;
using Enhabit.Repository.Contracts;

namespace Enhabit.Presenter.Commands
{
    public static class Users
    {
        public static Guid Find(IUserRepository repo, User user)
        {
            return repo.LoginUser(user);
        }

        public static Guid Create(IUserRepository repo, User user)
        {
            return repo.CreateUser(user);
        }
    }
}
