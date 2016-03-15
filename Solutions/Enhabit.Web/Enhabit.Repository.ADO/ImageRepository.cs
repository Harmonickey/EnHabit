using System;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.Repository.Contracts;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;

using log4net;

using Enhabit.Models;
using System.Transactions;
using IsolationLevel = System.Transactions.IsolationLevel;

namespace Enhabit.Repository.ADO
{
    public class ImageRepository : IImageRepository
    {
        private readonly string _enhabitConnString;
        private readonly TransactionScopeOption _transactionScopeOption;
        private readonly TransactionOptions _transactionOptions;

        public SqlConnection SqlConn { get; set; }

        public readonly ILog _logger;

        public ImageRepository(ILog logger, IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
            _transactionScopeOption = TransactionScopeOption.Required;
            _transactionOptions = new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted };
            _logger = logger;
        }

        public IEnumerable<string> GetAll(Guid picturesId)
        {
            var imageUrls = new List<string>();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetPictures]";
                cmd.Parameters.AddWithValue("@PicturesId", picturesId);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.HasRows && reader.Read())
                {
                    imageUrls.Add(reader["CloudinaryUrl"].ToString());
                }
            }

            return imageUrls;
        }

        public bool Save(Picture picture)
        {
            using (var transactionScope = new TransactionScope(_transactionScopeOption, _transactionOptions))
            {
                try
                {
                    using (SqlConn = new SqlConnection(_enhabitConnString))
                    {
                        SqlConn.Open();
                        using (var cmd = SqlConn.CreateCommand())
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandText = "[Enhabit].[SavePicture]";
                            cmd.Parameters.AddWithValue("@PicturesId", picture.PicturesId);
                            cmd.Parameters.AddWithValue("@PictureName", picture.PictureName);
                            cmd.Parameters.AddWithValue("@CloudinaryUrl", picture.CloudinaryUrl);

                            cmd.ExecuteNonQuery();
                        }
                    }

                    transactionScope.Complete();
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("ImageRepository.Save({0}) Exception: {1}", picture.PictureName, ex.Message));
                    return false;
                }
            }

            return true;
        }
    }
}
