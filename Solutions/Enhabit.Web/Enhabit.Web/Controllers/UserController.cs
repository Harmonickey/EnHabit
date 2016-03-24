using System.Web.Mvc;

using Enhabit.Presenter;
using Enhabit.Models;
using System;
using Enhabit.Models.Enums;
using System.Linq;
using log4net;

namespace Enhabit.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly UserPresenter Presenter;
        private readonly ILog _logger;

        public UserController(UserPresenter presenter, ILog logger)
        {
            Presenter = presenter;
            _logger = logger;
        }

        [HttpPost]
        public JsonResult Login(User user)
        {
            User loggedInUser = Presenter.LoginUser(user);

            if (loggedInUser.UserId != Guid.Empty)
            {
                Session["UserGuid"] = loggedInUser.UserId; // set the session with our user guid
                Session.Timeout = 60; // minutes

                var navLinks = Presenter.GetNavLinks(loggedInUser.UserId, (AccountType)loggedInUser.AccountTypeId);
                
                return Json(new { NavLinks = navLinks }, JsonRequestBehavior.DenyGet);
            }

            return Json(false, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public JsonResult Logout()
        {
            Session.Clear();
            
            return Json(true, JsonRequestBehavior.DenyGet);
        }

        public ActionResult Logout(string isFromPortal)
        {
            Session.Clear();

            return RedirectToAction("Index", "Enhabit");
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

                    var navLinks = Presenter.GetNavLinks(result, AccountType.Tenant);
                    return Json(new { NavLinks = navLinks}, JsonRequestBehavior.DenyGet);
                }

                return Json(false, JsonRequestBehavior.DenyGet);
            }
            catch(Exception ex)
            {
                _logger.Error("UserController.Create", ex);

                return Json(false, JsonRequestBehavior.DenyGet);
            }
        }

        [HttpPost]
        public JsonResult Update(User user)
        {
            try
            {
                user.UserId = (Guid)Session["UserGuid"];

                var result = Presenter.UpdateUser(user);

                return Json(result, JsonRequestBehavior.DenyGet);
            }
            catch (Exception ex)
            {
                _logger.Error("UserController.Update", ex);

                return Json(false, JsonRequestBehavior.DenyGet);
            }
        }

        [HttpPost]
        public JsonResult Delete(string password)
        {
            try
            {
                var result = Presenter.DeleteUser(Session["UserGuid"], password);

                return Json(result, JsonRequestBehavior.DenyGet);
            }
            catch (Exception ex)
            {
                _logger.Error("UserController.Delete", ex);

                return Json(false, JsonRequestBehavior.DenyGet);
            }
        }
    }
}