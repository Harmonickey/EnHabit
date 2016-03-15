using System;
using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IImageRepository
    {
        IEnumerable<string> GetAll(Guid picturesId);

        bool Save(Picture picture);
    }
}
