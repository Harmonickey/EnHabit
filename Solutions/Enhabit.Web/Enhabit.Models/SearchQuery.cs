using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Enhabit.Models
{
    public class SearchQuery
    {
        public int PriceRangeLow { get; set; }
        public int PriceRangeHigh { get; set; }
        public int Address { get; set; }

    }
}
