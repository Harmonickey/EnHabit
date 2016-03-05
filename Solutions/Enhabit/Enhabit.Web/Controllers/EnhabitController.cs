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
            //EnhabitMapViewModel vm = Presenter.GetEnhabitMap();

            return View();
        }
    }
}
