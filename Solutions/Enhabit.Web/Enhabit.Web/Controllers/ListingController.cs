using System.Web.Mvc;
using Enhabit.Presenter;
using Enhabit.Models;

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
            var result = Presenter.CreateListing(listing);

            return Json(result, JsonRequestBehavior.DenyGet);
        }
    }
}