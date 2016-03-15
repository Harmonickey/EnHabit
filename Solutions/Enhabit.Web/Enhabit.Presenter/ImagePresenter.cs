using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using Enhabit.Presenter.DataAdaptors;
using System.Collections.Generic;

namespace Enhabit.Presenter
{
    public sealed class ImagePresenter
    {
        private readonly IImageRepository  _imageRepo;
        private readonly ICloudinaryAdaptor _cloudinaryAdaptor;

        public ImagePresenter(IImageRepository imageRepo, ICloudinaryAdaptor cloudinaryAdaptor)
        {
            _imageRepo = imageRepo;
            _cloudinaryAdaptor = cloudinaryAdaptor;
        }

        public bool Save(string file)
        {
            return Pictures.Save(_imageRepo, _cloudinaryAdaptor, file);
        }
    }
}
