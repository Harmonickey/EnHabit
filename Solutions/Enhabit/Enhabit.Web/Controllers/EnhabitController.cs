using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Enhabit.ViewModels;
using Enhabit.Presenter;

namespace Enhabit.Controllers
{
    public class EnhabitController : Controller
    {
        public ActionResult Index()
        {
            EnhabitMapViewModel vm = new EnhabitMapViewModel
            {
                Listings = new List<ListingViewModel>
                {
                    new ListingViewModel
                    {
                        Price = 1500,
                        Address = "2615 Chestnut Ridge"
                    }
                },
                PriceRange = new PriceRangeViewModel
                {
                    Low = 250,
                    High = 900,
                    Step = 5
                }
            }; // Presenter.GetEnhabitMap();

            return View(vm);
        }
    }
}
