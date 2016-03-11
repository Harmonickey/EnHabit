using System.Collections.Generic;

using Enhabit.Presenter.DataAdaptors;

namespace Enhabit.Presenter.Commands
{
    public static class Pictures
    {
        public static IEnumerable<string> Save(ICloudinaryAdaptor cloudinary, IEnumerable<string> fileNames)
        {
            return cloudinary.Save(fileNames);
        }
    }
}
