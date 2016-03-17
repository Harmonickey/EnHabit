using System.Web.Mvc;
using Enhabit.Presenter;
using Enhabit.Models;
using Enhabit.ViewModels;

namespace Enhabit.Web.Controllers
{
    public class ListingController : Controller
    {
        private readonly ListingPresenter Presenter;

        public ListingController(ListingPresenter presenter)
        {
            Presenter = presenter;
        }

        [HttpPost]
        public JsonResult Create(Listing listing)
        {
            ListingViewModel result = Presenter.CreateListing(listing);
            
            if (result == null)
            {
                return Json(false, JsonRequestBehavior.DenyGet);
            }

            return Json(result, JsonRequestBehavior.DenyGet);
        }
    }
}