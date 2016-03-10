using Enhabit.Repository.Contracts;
using Enhabit.Models;
using Enhabit.Models.Enums;
using System;
using System.Data.SqlClient;
using Enhabit.Presenter.DataAdaptors;
using System.Data;
using System.Transactions;
using IsolationLevel = System.Transactions.IsolationLevel;

namespace Enhabit.Repository.ADO
{
    public class UserRepository : IUserRepository
    {
        private readonly string _enhabitConnString;

        public SqlConnection SqlConn { get; set; }

        public UserRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
        }

        public Guid LoginUser(User user)
        {
            var userGuid = Guid.Empty;

            using (SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[LoginUser]";
                    cmd.Parameters.AddWithValue("@Username", user.Username);
                    cmd.Parameters.AddWithValue("@Password", user.Password);
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        if (reader["UserId"] != DBNull.Value)
                            userGuid = (Guid)reader["UserId"];
                    }
                }
            }

            return userGuid;
        }

        public Guid CreateUser(User user)
        {
            var userGuid = Guid.Empty;

            using (var transactionScope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                try
                {
                    using (SqlConn = new SqlConnection(_enhabitConnString))
                    {
                        SqlConn.Open();
                        using (var cmd = SqlConn.CreateCommand())
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandText = "[Enhabit].[CreateUser]";
                            cmd.Parameters.AddWithValue("@Username", user.Username);
                            cmd.Parameters.AddWithValue("@Password", user.Password);
                            cmd.Parameters.AddWithValue("@Email", user.Email);
                            cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                            cmd.Parameters.AddWithValue("@LastName", user.LastName);
                            cmd.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);
                            cmd.Parameters.AddWithValue("@AccountTypeId", (int)AccountType.Tenant);
                            cmd.Parameters.AddWithValue("@IsActive", true);
                            cmd.Parameters.AddWithValue("@IsVerified", false);

                            SqlDataReader reader = cmd.ExecuteReader();

                            while (reader.HasRows && reader.Read())
                            {
                                if (reader["UserId"] != DBNull.Value)
                                    userGuid = (Guid)reader["UserId"];
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw new ApplicationException(string.Format("UserRepository.CreateUser({0}) Exception: {1}", user.Username, ex.Message));
                }
            }

            return userGuid;
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
