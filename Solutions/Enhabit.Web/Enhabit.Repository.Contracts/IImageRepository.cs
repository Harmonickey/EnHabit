using System;
using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IImageRepository
    {
        IEnumerable<Picture> GetListingsPictures(IEnumerable<Guid> pictureIds);

        bool DeleteByUrls(IEnumerable<string> pictureUrls);

        bool Save(Picture picture);
    }
}
