using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Models;

namespace Enhabit.ViewModels
{
    public class SearchResultViewModel
    {
        IEnumerable<Listing> Listings { get; set; }
    }
}
