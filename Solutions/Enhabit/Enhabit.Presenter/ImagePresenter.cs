using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Commands;
using System.Collections.Generic;

namespace Enhabit.Presenter
{
    public sealed class ImagePresenter
    {
        private readonly IImageRepository  _imageRepo;

        public ImagePresenter(IImageRepository imageRepo)
        {
            _imageRepo = imageRepo;
        }

        public IEnumerable<string> Save(IEnumerable<string> files)
        {
            return SavePictures.Save(_imageRepo, files);
        }
    }
}
