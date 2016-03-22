using System;
using System.Web.Mvc;
using Enhabit.Presenter;
using Enhabit.ViewModels;
using Enhabit.Models.Enums;

namespace Enhabit.Web.Controllers
{
    public class PortalController : Controller
    {
        private readonly PortalPresenter Presenter;

        public PortalController(PortalPresenter presenter)
        {
            Presenter = presenter;
        }

        public ActionResult Index()
        {
            if (Session["UserGuid"] != null)
            {
                var userGuid = Session["UserGuid"].ToString();

                var user = Presenter.GetUser(new Guid(userGuid));

                if ((AccountType)user.AccountTypeId == AccountType.Tenant)
                {
                    return RedirectToAction("Tenant");
                }

                return RedirectToAction("Landlord");
            }

            return RedirectToAction("Index", "Error");
        }

        public ActionResult Tenant()
        {
            if (Session["UserGuid"] != null)
            {
                var userGuid = Session["UserGuid"].ToString();

                TenantViewModel vm = Presenter.GetTenantPortal(new Guid(userGuid));
                
                return View(vm);
            }

            return Redirect("/");
        }

        public ActionResult Landlord()
        {
            if (Session["UserGuid"] != null)
            {
                var userGuid = Session["UserGuid"].ToString();

                LandlordViewModel vm = Presenter.GetLandlordPortal(new Guid(userGuid));

                return View(vm);
            }

            return View();
        }
    }
}
