using System;
using Enhabit.Presenter.DataAdaptors;

using Enhabit.Repository.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;

namespace Enhabit.Repository.ADO
{
    public class ImageRepository : IImageRepository
    {
        private readonly string _enhabitConnString;

        public SqlConnection SqlConn { get; set; }

        public ImageRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
        }

        public IEnumerable<string> GetAll(Guid imagesId)
        {
            var imageUrls = new List<string>();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetPictures]";
                cmd.Parameters.AddWithValue("@ImagesId", imagesId);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.HasRows && reader.Read())
                {
                    imageUrls.Add(reader["CloudinaryUrl"].ToString());
                }
            }

            return imageUrls;
        }
    }
}
