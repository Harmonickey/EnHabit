using Enhabit.Repository.Contracts;
using Enhabit.Models;
using Enhabit.Models.Enums;
using System;
using System.Data.SqlClient;
using Enhabit.Presenter.DataAdaptors;
using System.Data;
using System.Transactions;
using IsolationLevel = System.Transactions.IsolationLevel;
using System.Collections.Generic;
using log4net;
using Enhabit.Presenter.Extensions;

namespace Enhabit.Repository.ADO
{
    public class UserRepository : IUserRepository
    {
        private readonly string _enhabitConnString;
        private readonly TransactionScopeOption _transactionScopeOption;
        private readonly TransactionOptions _transactionOptions;

        private readonly ILog _logger;
        
        public UserRepository(IConfigAdaptor configAdaptor, ILog logger)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
            _transactionScopeOption = TransactionScopeOption.Required;
            _transactionOptions = new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted };
            _logger = logger;
        }

        public User LoginUser(User user)
        {
            using (var SqlConn = new SqlConnection(_enhabitConnString))
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
                        {
                            user.UserId = (Guid)reader["UserId"];
                        }
                        if (reader["AccountTypeId"] != DBNull.Value)
                        {
                            user.AccountTypeId = (int)reader["AccountTypeId"];
                        }
                    }
                }
            }

            return user;
        }

        public Guid CreateUser(User user)
        {
            using (var transactionScope = new TransactionScope(_transactionScopeOption, _transactionOptions))
            {
                try
                {
                    using (var SqlConn = new SqlConnection(_enhabitConnString))
                    {
                        SqlConn.Open();
                        using (var cmd = SqlConn.CreateCommand())
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandText = "[Enhabit].[CreateUser]";
                            cmd.Parameters.AddWithValue("@UserId", user.UserId);
                            cmd.Parameters.AddWithValue("@Username", user.Username);
                            cmd.Parameters.AddWithValue("@Password", user.Password);
                            cmd.Parameters.AddWithValue("@Email", user.Email);
                            cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                            cmd.Parameters.AddWithValue("@LastName", user.LastName);
                            cmd.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);
                            cmd.Parameters.AddWithValue("@AccountTypeId", user.AccountTypeId);
                            cmd.Parameters.AddWithValue("@IsActive", user.IsActive);
                            cmd.Parameters.AddWithValue("@IsVerified", user.IsVerified);

                            cmd.ExecuteNonQuery();
                        }
                    }

                    transactionScope.Complete();
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("UserRepository.CreateUser({0}) Exception: {1}", user.Username, ex.Message));
                    if (ex.Message.Contains("UC_EnhabitUsername"))
                    {
                        throw new Exception(ErrorType.UsernameAlreadyExists.GetDescription());
                    }
                    else if (ex.Message.Contains("UC_EnhabitEmail"))
                    {
                        throw new Exception(ErrorType.EmailAlreadyExists.GetDescription());
                    }
                    else
                    {
                        throw new Exception(ErrorType.Unknown.GetDescription());
                    }

                }
            }

            return user.UserId;
        }

        public bool DeleteUser(Guid userGuid, string password)
        {
            var deleted = false;

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[DeleteUser]";
                    cmd.Parameters.AddWithValue("@UserId", userGuid);
                    cmd.Parameters.AddWithValue("@Password", password);
                    int rows = cmd.ExecuteNonQuery();
    
                    deleted = rows > 0;                   
                }
            }

            return deleted;
        }

        public bool UpdateUser(User user)
        {
            using (var transactionScope = new TransactionScope(_transactionScopeOption, _transactionOptions))
            {
                try
                {
                    using (var SqlConn = new SqlConnection(_enhabitConnString))
                    {
                        SqlConn.Open();
                        using (var cmd = SqlConn.CreateCommand())
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandText = "[Enhabit].[UpdateUser]";
                            cmd.Parameters.AddWithValue("@UserId", user.UserId);
                            cmd.Parameters.AddWithValue("@Username", user.Username);
                            cmd.Parameters.AddWithValue("@Password", user.Password);
                            cmd.Parameters.AddWithValue("@Email", user.Email);
                            cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                            cmd.Parameters.AddWithValue("@LastName", user.LastName);
                            cmd.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);

                            cmd.ExecuteNonQuery();
                        }
                    }

                    transactionScope.Complete();
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("UserRepository.CreateUser({0}) Exception: {1}", user.Username, ex.Message));
                    if (ex.Message.Contains("UC_EnhabitUsername"))
                    {
                        throw new Exception(ErrorType.UsernameAlreadyExists.GetDescription());
                    }
                    else if (ex.Message.Contains("UC_EnhabitEmail"))
                    {
                        throw new Exception(ErrorType.EmailAlreadyExists.GetDescription());
                    }
                    else
                    {
                        throw new Exception(ErrorType.Unknown.GetDescription());
                    }

                }
            }

            return true;
        }

        public User GetUser(Guid userGuid)
        {
            var user = new User();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetUser]";
                    cmd.Parameters.AddWithValue("@UserId", userGuid);
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        user.Username = reader["Username"].ToString();
                        user.FirstName = reader["FirstName"].ToString();
                        user.LastName = reader["LastName"].ToString();
                        user.Email = reader["Email"].ToString();
                        user.PhoneNumber = reader["PhoneNumber"].ToString();
                        user.AccountTypeId = (int)reader["AccountTypeId"];
                    }
                }
            }

            user.UserId = userGuid;

            return user;
        }

        public IEnumerable<User> GetAllUsers(AccountType accountType)
        {
            var users = new List<User>();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetAllUsers]";
                    cmd.Parameters.AddWithValue("@AccountTypeId", (int)accountType);
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        users.Add(new User
                        { 
                            UserId = (Guid)reader["UserId"],
                            Username = reader["Username"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            Email = reader["Email"].ToString(),
                            PhoneNumber = reader["PhoneNumber"].ToString()
                        });
                    }
                }
            }

            return users;
        }
    }
}
