using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.Collections.Generic;
using System.Linq;
using Enhabit.Models;

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
        public string Save(string filePath, string publicId)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(filePath),
                PublicId = publicId
            };
            var uploadResult = _cloudinary.Upload(uploadParams);

            return uploadResult.JsonObj.Value<string>("secure_url");
        }

        /// <summary>
        /// Delete the images from Cloudinary
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public void Delete(IEnumerable<string> publicIds)
        {
            // I don't care about a return, or the order - just delete them all
            publicIds.AsParallel().ForAll(Delete);
        }

        /// <summary>
        /// Delete an image from Cloudinary
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        private void Delete(string publicId)
        {
            // delete an image
            _cloudinary.DestroyAsync(new DeletionParams(publicId));
        }
    }
}
