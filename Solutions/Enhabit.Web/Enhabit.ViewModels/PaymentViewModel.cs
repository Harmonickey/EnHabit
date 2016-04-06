using System;
using System.Collections.Generic;
using System.Globalization;

namespace Enhabit.ViewModels
{
    public class PaymentViewModel
    {
        public string Address { get; set; }
        public string Unit { get; set; }
        public decimal Rent { get; set; }
        public string LandlordEmail { get; set; }
        public string NextMonth
        {
            get
            {
                DateTime today = new DateTime();
                today.AddMonths(1);

                return today.ToString("MMMM", CultureInfo.InvariantCulture);
            }
        }

        public IEnumerable<PaymentHistoryViewModel> PaymentHistory { get; set; }
    }
}
