using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Enhabit.Models;

namespace Enhabit.ViewModels
{
    public class ListingViewModel
    {
        public float Price { get; set; }
        public string Address { get; set; }
        public DateTime AvailableStartDate { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; }
        public string OwnerName { get; set; }
        public string LandlordName { get; set; }
    }
}
