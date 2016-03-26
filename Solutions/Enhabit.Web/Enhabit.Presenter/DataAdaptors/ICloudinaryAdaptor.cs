using Enhabit.Models;
using System.Collections.Generic;

namespace Enhabit.Presenter.DataAdaptors
{
    public interface ICloudinaryAdaptor
    {
        string Save(string filePath, string publicId);

        void Delete(IEnumerable<string> publicIds);
    }
}
