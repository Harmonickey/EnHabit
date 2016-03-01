using System;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.Models;
using Enhabit.Repository.Contracts;

using System.IO;

namespace Enhabit.Presenter.Commands
{
    public static class Pictures
    {
        public static bool Save(IImageRepository repo, ICloudinaryAdaptor cloudinary, string fileName, string publicId)
        {
            var pictureGuid = Path.GetFileName(fileName).Split('_')[0];

            var imageUrl = cloudinary.Save(fileName, publicId);

            var picture = new Picture
            {
                PicturesId = new Guid(pictureGuid),
                CloudinaryUrl = imageUrl,
                CloudinaryPublicId = publicId
            };

            return repo.Save(picture);
        }
    }
}
