using System;
using System.Collections.Generic;
using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IImageRepository
    {
        IEnumerable<Picture> GetListingsPictures(IEnumerable<Guid> pictureIds);

        bool DeleteByPublicIds(IEnumerable<string> pictureCloudinaryPublicIds);

        bool Save(Picture picture);
    }
}
