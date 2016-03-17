using System;
using System.Web.Mvc;
using Enhabit.Presenter;
using Enhabit.ViewModels;

namespace Enhabit.Web.Controllers
{
    public class PortalController : Controller
    {
        private readonly PortalPresenter Presenter;

        public PortalController(PortalPresenter presenter)
        {
            Presenter = presenter;
        }

        public ActionResult Tenant()
        {
            if (Session["UserGuid"] != null)
            {
                var userGuid = (string)Session["UserGuid"];

                TenantViewModel vm = Presenter.GetTenantPortal(new Guid(userGuid));

                return View(vm);
            }

            return Redirect("/");
        }

        public ActionResult Landlord()
        {
            if (Session["UserGuid"] != null)
            {
                var userGuid = (string)Session["UserGuid"];

                LandlordViewModel vm = Presenter.GetLandlordPortal(new Guid(userGuid));

                return View(vm);
            }

            return View();
        }
    }
}
