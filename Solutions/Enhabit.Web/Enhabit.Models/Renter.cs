using System;

namespace Enhabit.Models
{
    public class Renter
    {
        public Guid RenterId { get; set; }
        public Guid UserId { get; set; }
        public Guid ListingId { get; set; }
        public bool HasPaid { get; set; }
        public DateTime RentDueDate { get; set; }
    }
}
