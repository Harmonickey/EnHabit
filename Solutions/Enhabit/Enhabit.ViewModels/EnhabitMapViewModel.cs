using System.Collections.Generic;

namespace Enhabit.ViewModels
{
    public class EnhabitMapViewModel
    {
        public IEnumerable<ListingViewModel> Listings { get; set; }

        public PriceRangeViewModel PriceRange {get; set;}
    }
}
