using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IUserRepository
    {
        bool LoginUser(User user);

        bool CreateUser(User user);

        bool DeleteUser(User user);

        bool UpdateUser(User user);
    }
}
