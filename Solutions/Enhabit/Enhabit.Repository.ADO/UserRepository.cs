using Enhabit.Repository.Contracts;
using Enhabit.Models;

namespace Enhabit.Repository.ADO
{
    public class UserRepository : IUserRepository
    {
        public UserRepository()
        {

        }

        public bool LoginUser(User user)
        {
            return true;
        }

        public bool CreateUser(User user)
        {
            return true;
        }

        public bool DeleteUser(User user)
        {
            return true;
        }

        public bool UpdateUser(User user)
        {
            return true;
        }
    }
}
