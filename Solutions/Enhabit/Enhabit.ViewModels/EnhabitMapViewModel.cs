using System.Collections.Generic;

namespace Enhabit.ViewModels
{
    public class EnhabitMapViewModel
    {
        public string DefaultListingPicture { get; set; }

        public IEnumerable<ListingViewModel> Listings { get; set; }

        public IEnumerable<UniversityViewModel> Universities { get; set; }

        public IEnumerable<LandlordViewModel> Landlords { get; set; }

        public PriceRangeViewModel PriceRange {get; set;}

        public IEnumerable<NavLinkViewModel> NavLinks { get; set; }
    }
}
