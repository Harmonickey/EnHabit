using System.Collections.Generic;
using System;

namespace Enhabit.ViewModels
{
    public class EnhabitMapViewModel
    {
        public string DefaultListingPicture { get; set; }

        public IEnumerable<ListingViewModel> Listings { get; set; }

        public IEnumerable<UniversityViewModel> Universities { get; set; }

        public IEnumerable<UserViewModel> Landlords { get; set; }

        public PriceRangeViewModel PriceRange {get; set;}

        public IEnumerable<NavLinkViewModel> NavLinks { get; set; }

        public bool UserLoggedIn { get; set; }

        public Guid CreateListingPictureGuid { get; set; }

        public UserViewModel User { get; set; }
    }
}
