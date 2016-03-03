using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Models;
using Enhabit.ViewModels;

namespace Enhabit.Presenter.Extensions
{
    public static class EnhabitMapExtensions
    {
        public static ListingViewModel ToListingViewModel(this Listing listing)
        {
            return new ListingViewModel();
        }


    }
}
