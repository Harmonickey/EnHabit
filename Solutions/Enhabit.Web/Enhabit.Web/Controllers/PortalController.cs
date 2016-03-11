using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Enhabit.Web.Controllers
{
    public class PortalController : Controller
    {
        public ActionResult Tenant()
        {
            return View();
        }

        public ActionResult Landlord()
        {
            return View();
        }
    }
}
