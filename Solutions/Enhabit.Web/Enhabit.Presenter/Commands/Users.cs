using System;
using Enhabit.Models;
using Enhabit.Repository.Contracts;
using System.Collections.Generic;
using Enhabit.ViewModels;
using Enhabit.Models.Enums;
using System.Linq;
using Enhabit.Presenter.Extensions;

namespace Enhabit.Presenter.Commands
{
    public static class Users
    {
        public static User Login(IUserRepository repo, User user)
        {
            return repo.LoginUser(user);
        }

        public static Guid Create(IUserRepository repo, User user)
        {
            var userGuid = Guid.NewGuid();

            user.UserId = userGuid;
            user.AccountTypeId = (int)AccountType.Tenant;
            user.IsActive = true;
            user.IsVerified = true;

            return repo.CreateUser(user);
        }

        public static User Update(IUserRepository repo, User user)
        {
            return repo.UpdateUser(user);
        }

        public static bool Delete(IUserRepository repo, Guid userGuid, string password)
        {
            return repo.DeleteUser(userGuid, password);
        }

        public static IEnumerable<UserViewModel> GetLandlords(IUserRepository repo)
        {
            return repo.GetAllUsers(AccountType.Landlord).Select(u => u.ToUserViewModel());
        }

        public static IEnumerable<UserViewModel> GetTenants(IUserRepository repo)
        {
            return repo.GetAllUsers(AccountType.Tenant).Select(u => u.ToUserViewModel());
        }

        public static UserViewModel Get(IUserRepository repo, Guid userGuid)
        {
            return repo.GetUser(userGuid).ToUserViewModel();
        }
    }
}
