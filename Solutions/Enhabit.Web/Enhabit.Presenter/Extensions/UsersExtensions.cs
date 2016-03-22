using Enhabit.Models;
using Enhabit.ViewModels;

namespace Enhabit.Presenter.Extensions
{
    public static class UsersExtensions
    {
        public static UserViewModel ToUserViewModel(this User user)
        {
            return new UserViewModel
            {
                UserId = user.UserId,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                AccountTypeId = user.AccountTypeId
            };
        }
    }
}
