using Enhabit.Web.ControllerFactory;
using Microsoft.Practices.Unity;
using System.Diagnostics;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Enhabit.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {/*
            if (!EventLog.SourceExists("Enhabit.Web"))
            {
                EventLog.CreateEventSource("Enhabit.Web", "EnhabitApplication");

                return;
            }
            */
            AreaRegistration.RegisterAllAreas();

            var container = new UnityContainer();
            Bootstrapper.RegisterControllers(container);
            Bootstrapper.RegisterAdaptors(container);
            Bootstrapper.RegisterRepositories(container);

            var factory = new IocControllerFactory(container);
            ControllerBuilder.Current.SetControllerFactory(factory);

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}