using Enhabit.Models;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using System;

namespace Enhabit.Presenter
{
    public sealed class UserPresenter
    {
        private readonly IUserRepository _userRepo;

        public UserPresenter(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public Guid LoginUser(User user)
        {
            return Users.Find(_userRepo, user);
        }

        public Guid CreateUser(User user)
        {
            return Users.Create(_userRepo, user);
        }
    }
}
