using Enhabit.Models;
using Enhabit.Models.Enums;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using System;
using System.Collections.Generic;
using Enhabit.ViewModels;

namespace Enhabit.Presenter
{
    public sealed class UserPresenter
    {
        private readonly IUserRepository _userRepo;

        public UserPresenter(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public User LoginUser(User user)
        {
            return Users.Login(_userRepo, user);
        }

        public Guid CreateUser(User user)
        {
            return Users.Create(_userRepo, user);
        }

        public IEnumerable<NavLinkViewModel> GetNavLinks(AccountType accountType)
        {
            if (accountType == AccountType.Admin)
            {
                return NavLinks.Admin();
            }
            else if (accountType == AccountType.Landlord)
            {
                return NavLinks.Landlord();
            }

            return NavLinks.Tenant();
        }
    }
}
