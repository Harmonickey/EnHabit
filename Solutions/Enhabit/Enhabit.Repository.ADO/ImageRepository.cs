using System;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Enhabit.Presenter.DataAdaptors;

using Enhabit.Repository.Contracts;
using System.Collections.Generic;
using System.Linq;

namespace Enhabit.Repository.ADO
{
    public class ImageRepository : IImageRepository
    {
        private Cloudinary _cloudinary;

        public ImageRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");
            
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
        public IEnumerable<string> SaveImages(IEnumerable<string> filePaths)
        {
            return filePaths.Select(SaveImage);
        }

        private string SaveImage(string filePath)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(filePath)
            };
            var uploadResult = _cloudinary.Upload(uploadParams);

            return uploadResult.JsonObj.Value<string>("secure_url");
        }
    }
}
