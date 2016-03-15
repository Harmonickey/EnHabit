using System;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.Models;
using Enhabit.Repository.Contracts;

namespace Enhabit.Presenter.Commands
{
    public static class Pictures
    {
        public static bool Save(IImageRepository repo, ICloudinaryAdaptor cloudinary, string fileName)
        {
            var pictureGuid = fileName.Split('_')[0];

            var imageUrl = cloudinary.Save(fileName);

            var picture = new Picture
            {
                PicturesId = new Guid(pictureGuid),
                PictureName = fileName,
                CloudinaryUrl = imageUrl
            };

            return repo.Save(picture);
        }
    }
}
