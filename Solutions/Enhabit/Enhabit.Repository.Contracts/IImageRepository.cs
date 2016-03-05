using System.Collections.Generic;

namespace Enhabit.Repository.Contracts
{
    public interface IImageRepository
    {
        IEnumerable<string> SaveImages(IEnumerable<string> filePath);
    }
}
