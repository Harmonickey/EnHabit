using System;
using System.Collections.Generic;

namespace Enhabit.Models
{
    public class Listing
    {
        public Guid ListingId { get; set; }
        public Guid UserId { get; set; }
        public Guid PicturesId { get; set; }
        public Guid UniversityId { get; set; }
        public float Price { get; set; }
        public string Address { get; set; }
        public string Unit { get; set; }
        public decimal XCoordinate { get; set; }
        public decimal YCoordinate { get; set; }
        public IEnumerable<string> ImageUrls { get; set; }
        public DateTime AvailableStartDate { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsRented { get; set; }
        public bool IsActive { get; set; }
        public bool IsTesting { get; set; }
        public string TenantName { get; set; }
        public string LandlordName { get; set; }
        public int LeaseType { get; set; }
        public int BuildingType { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public string Notes { get; set; }
        public int Animals { get; set; }
        public int Laundry { get; set; }
        public int Parking { get; set; }
        public bool HasAirConditioning { get; set; }
    }
}
