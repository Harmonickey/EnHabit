using System.Web.Mvc;

using Enhabit.Presenter;
using Enhabit.Models;
using System;
using Enhabit.Models.Enums;

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
                Session.Timeout = 60; // minutes
                return Json(true, JsonRequestBehavior.DenyGet);
            }

            return Json(false, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public JsonResult Logout(User user)
        {
            Session.Clear();

            return Json(true, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public JsonResult Create(User user)
        {
            //validate user here...

            try
            {
                var result = Presenter.CreateUser(user);

                if (result != Guid.Empty)
                {
                    Session["UserGuid"] = result; // set the session with our user guid
                    return Json(result, JsonRequestBehavior.DenyGet);
                }
            }
            catch(Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.DenyGet);
            }
            
            return Json(false, JsonRequestBehavior.DenyGet);
        }
    }
}