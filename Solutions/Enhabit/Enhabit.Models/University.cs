using System;

namespace Enhabit.Models
{
    public class University
    {
        public Guid UniversityId { get; set; }
        public string Name { get; set; }
        public decimal MaxListingDistance { get; set; }
        public string Address { get; set; }
        public string XCoordinate { get; set; }
		public string YCoordinate { get; set; }
    }
}
