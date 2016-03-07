using System;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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
        private Cloudinary _cloudinary;

        private readonly string _enhabitConnString;

        public SqlConnection SqlConn { get; set; }

        public ImageRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;

            Account account = new Account(
              configAdaptor.CloudinaryCloudName,
              configAdaptor.CloudinaryApiKey,
              configAdaptor.CloudinaryApiSecret);

            _cloudinary = new Cloudinary(account);
        }

        /// <summary>
        /// Upload the image to Cloudinary
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public IEnumerable<string> Save(IEnumerable<string> filePaths)
        {
            return filePaths.Select(Save);
        }

        private string Save(string filePath)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(filePath)
            };
            var uploadResult = _cloudinary.Upload(uploadParams);

            return uploadResult.JsonObj.Value<string>("secure_url");
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
