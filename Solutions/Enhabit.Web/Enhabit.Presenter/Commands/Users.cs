﻿using System;
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
        public static Guid Find(IUserRepository repo, User user)
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

        public static IEnumerable<UserViewModel> GetLandlords(IUserRepository repo)
        {
            return repo.GetUsers(AccountType.Landlord).Select(u => u.ToUserViewModel());
        }
    }
}
