using System.Collections.Generic;

using Enhabit.Repository.Contracts;

namespace Enhabit.Presenter.Commands
{
    public static class SavePictures
    {
        public static IEnumerable<string> Save(IImageRepository repo, IEnumerable<string> fileNames)
        {
            return repo.Save(fileNames);
        }
    }
}
