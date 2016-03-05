using System;
using System.Collections.Generic;

namespace Enhabit.ViewModels
{
    public class ListingViewModel
    {
        public Guid ListingId { get; set; }
        public float Price { get; set; }
        public string Address { get; set; }
        public string Unit { get; set; }
        public decimal XCoordinates { get; set; }
        public decimal YCoordinates { get; set; }
        public IEnumerable<string> Images { get; set; }
        public IEnumerable<string> Thumbnails { get; set; }
        public DateTime AvailableStartDate { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; }
        public bool IsTesting { get; set; }
        public string TenantName { get; set; }
        public string LandlordName { get; set; }
        public int LeaseType { get; set; }
        public int BuildingType { get; set; }
        public string Notes { get; set; }
        public int Animals { get; set; }
        public int Laundry { get; set; }
        public int Parking { get; set; }
        public bool HasAirConditioning { get; set; }
    }
}
