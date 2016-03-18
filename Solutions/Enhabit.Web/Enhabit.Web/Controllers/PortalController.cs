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
                var userGuid = (string)Session["UserGuid"];

                var user = Presenter.GetUser(new Guid(userGuid));

                if ((AccountType)user.AccountTypeId == AccountType.Tenant)
                {
                    return RedirectToAction("Tenant");
                }
                else if ((AccountType)user.AccountTypeId == AccountType.Landlord)
                {
                    return RedirectToAction("Landlord");
                }
                else if ((AccountType)user.AccountTypeId == AccountType.Admin)
                {
                    return Redirect("/Admin");
                }
            }

            return RedirectToAction("Index", "Error");
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
