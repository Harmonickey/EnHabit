using Enhabit.Presenter;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.Repository.Contracts;
using Enhabit.Repository;
using Enhabit.Adaptors;
using Enhabit.Controllers;

using Microsoft.Practices.Unity;

namespace Enhabit
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
        }

        /// <summary>
        /// Registers Logger, Presenters and Controllers
        /// </summary>
        /// <param name="container"></param>
        public static void RegisterControllers(IUnityContainer container)   
        {
            container.RegisterType<EnhabitMapPresenter, EnhabitMapPresenter>();
            container.RegisterType<EnhabitController, EnhabitController>();
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