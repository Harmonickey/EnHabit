using Enhabit.Models;
using Enhabit.Models.Enums;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using System;
using System.Collections.Generic;
using Enhabit.ViewModels;
using System.Linq;

namespace Enhabit.Presenter
{
    public sealed class UserPresenter
    {
        readonly IUserRepository _userRepo;
        readonly IRenterRepository _renterRepo;

        public UserPresenter(IUserRepository userRepo, IRenterRepository renterRepo)
        {
            _userRepo = userRepo;
            _renterRepo = renterRepo;
        }

        public User LoginUser(User user)
        {
            return Users.Login(_userRepo, user);
        }

        public Guid CreateUser(User user)
        {
            return Users.Create(_userRepo, user);
        }

        public IEnumerable<NavLinkViewModel> GetNavLinks(Guid userGuid, AccountType accountType)
        {
            var hasRental = Renters.UserHasRental(_renterRepo, userGuid);
            
            if (accountType == AccountType.Tenant)
            {
                return NavLinks.Tenant(hasRental).ToList();
            }

            return NavLinks.Landlord().ToList();
        }
    }
}
