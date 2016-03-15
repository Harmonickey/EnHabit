using Enhabit.Presenter;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.Repository.ADO;
using Enhabit.Repository.Contracts;
using Enhabit.Adaptors;
using Enhabit.Web.Controllers;

using Microsoft.Practices.Unity;

using log4net;
using log4net.Config;
using System.Configuration;
using System.IO;

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
            container.RegisterType<ICloudinaryAdaptor, CloudinaryAdaptor>();
        }

        /// <summary>
        /// Registers all repositories for Horizon
        /// </summary>
        /// <param name="container"></param>
        public static void RegisterRepositories(IUnityContainer container)
        {
            container.RegisterType<IListingRepository, ListingRepository>();
            container.RegisterType<IImageRepository, ImageRepository>();
            container.RegisterType<IPortalRepository, PortalRepository>();
            container.RegisterType<IUserRepository, UserRepository>();
            container.RegisterType<IPricingRepository, PricingRepository>();
            container.RegisterType<IUniversityRepository, UniversityRepository>();
        }

        /// <summary>
        /// Registers Logger, Presenters and Controllers
        /// </summary>
        /// <param name="container"></param>
        public static void RegisterControllers(IUnityContainer container)   
        {
            XmlConfigurator.Configure();
            container.RegisterInstance(typeof(ILog), LogManager.GetLogger("EventLogger"));
            container.RegisterType<EnhabitMapPresenter, EnhabitMapPresenter>();
            container.RegisterType<UserPresenter, UserPresenter>();
            container.RegisterType<ImagePresenter, ImagePresenter>();

            container.RegisterType<EnhabitController, EnhabitController>();
            container.RegisterType<PortalController, PortalController>();
            container.RegisterType<UserController, UserController>();
            container.RegisterType<ImageController, ImageController>();
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