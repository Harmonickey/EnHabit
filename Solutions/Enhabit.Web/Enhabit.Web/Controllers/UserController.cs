using System.Web.Mvc;

using Enhabit.Presenter;
using Enhabit.Models;
using System;

namespace Enhabit.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly UserPresenter Presenter;

        public UserController(UserPresenter presenter)
        {
            Presenter = presenter;
        }

        [HttpPost]
        public JsonResult Login(User user)
        {
            var result = Presenter.LoginUser(user);

            if (result != Guid.Empty)
            {
                Session["UserGuid"] = result; // set the session with our user guid
                return Json(true, JsonRequestBehavior.DenyGet);
            }

            return Json(false, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public JsonResult Create(User user)
        {
            var result = Presenter.CreateUser(user);

            if (result != Guid.Empty)
            {
                Session["UserGuid"] = result; // set the session with our user guid
                return Json(true, JsonRequestBehavior.DenyGet);
            }

            return Json(false, JsonRequestBehavior.DenyGet);
        }
    }
}