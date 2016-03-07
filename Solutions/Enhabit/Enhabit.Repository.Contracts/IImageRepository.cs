using System;
using System.Collections.Generic;

namespace Enhabit.Repository.Contracts
{
    public interface IImageRepository
    {
        IEnumerable<string> Save(IEnumerable<string> filePaths);

        IEnumerable<string> GetAll(Guid imagesId);
    }
}
