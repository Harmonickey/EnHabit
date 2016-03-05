using System.Web;
using System.Web.Optimization;

namespace Enhabit
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Scripts/ThirdParty").Include(
                        "~/Scripts/ThirdParty/jquery-1.7.1.js",
                        "~/Scripts/ThirdParty/jquery-ui-1.8.20.js",
                        "~/Scripts/ThirdParty/knockout-2.1.0.js"));

            bundles.Add(new ScriptBundle("~/Scripts/Common").Include(
                        "~/Scripts/Common/custom_bindings.js"));

            bundles.Add(new ScriptBundle("~/Scripts/Portal").Include(
                        "~/Scripts/Portal/portal.js"));

            bundles.Add(new ScriptBundle("~/Scripts/EnhabitMap").Include(
                        "~/Scripts/EnhabitMap/index.js"));

            bundles.Add(new StyleBundle("~/Content/ThirdParty").Include(
                        "~/Content/ThirdParty/bootstrap.css",
                        "~/Content/ThirdParty/bootstrap-theme.css",
                        "~/Content/ThirdParty/owl.carousel.css",
                        "~/Content/ThirdParty/owl.theme.css",
                        "~/Content/ThirdParty/owl.transitions.css",
                        "~/Content/ThirdParty/bootstrap-switch.css",
                        "~/Content/ThirdParty/dropzone.css",
                        "~/Content/ThirdParty/pikaday.css",
                        "~/Content/ThirdParty/msgGrowl.css"));

            bundles.Add(new StyleBundle("~/Content/Enhabit").Include(
                        "~/Content/EnhabitMap/main.css",
                        "~/Content/EnhabitMap/custom.css"));

            
        }
    }
}