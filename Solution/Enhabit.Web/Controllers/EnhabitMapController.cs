using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Enhabit.ViewModels;
using Enhabit.Models;
using Enhabit.Presenter;

namespace Enhabit.Controllers
{
    public class EnhabitMapController : Controller
    {
        private EnhabitMapPresenter Presenter { get; set; }

        public EnhabitMapController(EnhabitMapPresenter presenter)
        {
            Presenter = presenter;
        }

        public ActionResult Index()
        {
            EnhabitMapViewModel vm = Presenter.GetEnhabitMap();

            return View();
        }

        [HttpPost]
        public JsonResult SearchForListings(SearchQuery query)
        {
            var result = Presenter.SearchForListings(query);

            return Json(result, JsonRequestBehavior.DenyGet);
        }
    }
}
