using Enhabit.Presenter;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.Repository.ADO;
using Enhabit.Repository.Contracts;
using Enhabit.Adaptors;
using Enhabit.Web.Controllers;

using Microsoft.Practices.Unity;

namespace Enhabit.Web
{
    public class Bootstrapper
    {
        /// <summary>
        /// Registers all types of adaptors (Config, DB, FileSvc) etc
        /// </summary>
        /// <param name="container"></param>
        public static void RegisterAdaptors(IUnityContainer container)
        {
            container.RegisterType<IConfigAdaptor, ConfigAdaptor>();
        }

        /// <summary>
        /// Registers all repositories for Horizon
        /// </summary>
        /// <param name="container"></param>
        public static void RegisterRepositories(IUnityContainer container)
        {
            container.RegisterType<IEnhabitMapRepository, EnhabitMapRepository>();
            container.RegisterType<IImageRepository, ImageRepository>();
            container.RegisterType<IPortalRepository, PortalRepository>();
            container.RegisterType<IUserRepository, UserRepository>();
        }

        /// <summary>
        /// Registers Logger, Presenters and Controllers
        /// </summary>
        /// <param name="container"></param>
        public static void RegisterControllers(IUnityContainer container)   
        {
            container.RegisterType<EnhabitMapPresenter, EnhabitMapPresenter>();
            container.RegisterType<UserPresenter, UserPresenter>();
            container.RegisterType<EnhabitController, EnhabitController>();
            container.RegisterType<PortalController, PortalController>();
            container.RegisterType<UserController, UserController>();
        }

        /// <summary>
        /// Registers the providers, helpers, and builders
        /// </summary>
        /// <param name="container"></param>
        public static void RegisterHelpers(IUnityContainer container)
        {
            
        }
    }
}