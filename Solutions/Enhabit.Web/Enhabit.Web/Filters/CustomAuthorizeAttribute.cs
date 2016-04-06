using System;
using System.Web.Mvc;
using System.Web.Routing;

namespace Enhabit.Web.Filters
{
    public class CustomAuthorizeAttribute : ActionFilterAttribute
    {
        private const string EnhabitHomeController = "Enhabit";
        private const string UserController = "User";

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string controllerName = context.ActionDescriptor.ControllerDescriptor.ControllerName;

            try
            {
                if (!controllerName.Equals(EnhabitHomeController) && !controllerName.Equals(UserController))
                {
                    var user = context.HttpContext.Session.Contents["UserGuid"];

                    if (user == null)
                    {
                        //Redirect to landing
                        context.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                        {
                            controller = "Enhabit",
                            action = "Index"
                        }));
                    }
                }
            }
            catch (Exception)
            {
                //Redirect to landing
                context.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                {
                    controller = "Enhabit",
                    action = "Index"
                }));
            }
        }
    }
}