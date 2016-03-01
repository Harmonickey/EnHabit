using System.Collections.Generic;
using System.Web.Mvc;

using Enhabit.ViewModels;
using Enhabit.Models.Enums;
using Enhabit.Presenter;

namespace Enhabit.Web.Controllers
{
    public class EnhabitController : Controller
    {
        private readonly EnhabitMapPresenter Presenter;
        
        public EnhabitController(EnhabitMapPresenter presenter)
        {
            Presenter = presenter;
        }

        /// <summary>
        ///     /Enhabit/Index
        /// </summary>
        /// <returns></returns>

        public ActionResult Index()
        {
            var userLoggedIn = Session["UserGuid"] != null;

            EnhabitMapViewModel vm = Presenter.GetEnhabitMap(Session["UserGuid"]);          
            vm.UserLoggedIn = userLoggedIn;

            return View(vm);
        }

        /// <summary>
        /// /Enhabit/SearchForListings
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>

        [HttpPost]
        public JsonResult SearchForListings(SearchQueryViewModel query)
        {
            SearchResultViewModel result = new SearchResultViewModel
            {
                Listings = new List<ListingViewModel>
                {
                    new ListingViewModel
                    {
                        Price = 1500,
                        Address = "2615 Chestnut Ridge"
                    }
                }
            };

            return Json(result, JsonRequestBehavior.DenyGet);
        }
    }
}
