using System;
using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IImageRepository
    {
        IEnumerable<Picture> GetListingPictures(IEnumerable<Guid> pictureIds);

        bool Save(Picture picture);
    }
}
