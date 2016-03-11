using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Enhabit.ViewModels
{
    public class SearchQueryViewModel
    {
        public int PriceRangeLow { get; set; }
        public int PriceRangeHigh { get; set; }
        public DateTime StartDate { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public int Parking { get; set; }
        public int Animals { get; set; }
        public int Laundry { get; set; }
        public bool AirConditioning { get; set; }
        public int LeaseType { get; set; }
        public int BuildingType { get; set; }
    }
}
