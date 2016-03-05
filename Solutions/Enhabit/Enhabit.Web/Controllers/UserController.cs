using System.Web.Mvc;

using Enhabit.Presenter;
using Enhabit.ViewModels;

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
        public JsonResult LoginUser(UserViewModel user)
        {
            var result = Presenter.LoginUser(user);

            return Json(result, JsonRequestBehavior.DenyGet);
        }
    }
}