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

        public IEnumerable<string> Save(IEnumerable<string> files)
        {
            return Pictures.Save(_cloudinaryAdaptor, files);
        }
    }
}
