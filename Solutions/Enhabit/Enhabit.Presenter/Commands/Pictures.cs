using System.Collections.Generic;

using Enhabit.Repository.Contracts;

namespace Enhabit.Presenter.Commands
{
    public static class Pictures
    {
        public static IEnumerable<string> Save(IImageRepository repo, IEnumerable<string> fileNames)
        {
            return repo.Save(fileNames);
        }
    }
}
