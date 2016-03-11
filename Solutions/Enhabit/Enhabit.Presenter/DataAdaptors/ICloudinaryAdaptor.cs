using System.Collections.Generic;

namespace Enhabit.Presenter.DataAdaptors
{
    public interface ICloudinaryAdaptor
    {
        IEnumerable<string> Save(IEnumerable<string> filePaths);
    }
}
