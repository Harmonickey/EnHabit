using Enhabit.Repository.Contracts;
using Enhabit.Models;
using System;
using System.Data.SqlClient;
using Enhabit.Presenter.DataAdaptors;
using System.Data;
using System.Transactions;
using IsolationLevel = System.Transactions.IsolationLevel;
using System.Collections.Generic;
using log4net;

namespace Enhabit.Repository.ADO
{
    public class RenterRepository : IRenterRepository
    {
        private readonly string _enhabitConnString;
        private readonly TransactionScopeOption _transactionScopeOption;
        private readonly TransactionOptions _transactionOptions;

        private readonly ILog _logger;

        public SqlConnection SqlConn { get; set; }

        public RenterRepository(IConfigAdaptor configAdaptor, ILog logger)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
            _transactionScopeOption = TransactionScopeOption.Required;
            _transactionOptions = new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted };
            _logger = logger;
        }

        /// <summary>
        /// Get all the landlords renters
        /// </summary>
        /// <param name="userGuid"></param>
        /// <returns></returns>
        public IEnumerable<Renter> GetUserRenters(Guid userGuid)
        {
            var renters = new List<Renter>();

            using (SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetUserRenters]";
                    cmd.Parameters.AddWithValue("@UserId", userGuid);
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        renters.Add(new Renter
                        {
                            RenterId = (Guid)reader["RenterId"],
                            UserId = (Guid)reader["UserId"],
                            ListingId = (Guid)reader["ListingId"],
                            HasPaid = (bool)reader["HasPaid"],
                            RentDueDate = (DateTime)reader["PhoneNumber"]
                        });
                    }
                }
            }

            return renters;
        }

        /// <summary>
        /// Check if the user has a rental
        /// </summary>
        /// <param name="userGuid"></param>
        /// <returns></returns>
        public bool UserHasRental(Guid userGuid)
        {
            bool hasRental = false;

            using (SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[UserHasRental]";
                    cmd.Parameters.AddWithValue("@UserId", userGuid);
                    SqlDataReader reader = cmd.ExecuteReader();

                    hasRental = (reader.HasRows && reader.Read() && reader["UserId"] != DBNull.Value);
                }
            }

            return hasRental;
        }
    }
}
