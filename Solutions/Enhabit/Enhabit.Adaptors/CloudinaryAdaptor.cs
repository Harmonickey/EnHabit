using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.Collections.Generic;
using System.Linq;

using Enhabit.Presenter.DataAdaptors;

namespace Enhabit.Adaptors
{
    public class CloudinaryAdaptor : ICloudinaryAdaptor
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryAdaptor(IConfigAdaptor configAdaptor)
        {
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
    }
}
