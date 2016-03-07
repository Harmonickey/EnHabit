using System.Web;
using System.Web.Optimization;

namespace Enhabit.Web
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        { 
            bundles.Add(new ScriptBundle("~/Enhabit/ThirdParty").Include(
                        "~/Scripts/ThirdParty/bootstrap.js",
                        "~/Scripts/ThirdParty/owl.carousel.js",
                        "~/Scripts/ThirdParty/jquery.easing.1.3.js",
                        "~/Scripts/ThirdParty/jquery.geocomplete.js",
                        "~/Scripts/ThirdParty/detectmobilebrowser.js",
                        "~/Scripts/ThirdParty/jquery.autoNumeric.js",
                        "~/Scripts/ThirdParty/bootstrap-switch.js",
                        "~/Scripts/ThirdParty/msgGrowl.js",
                        "~/Scripts/ThirdParty/dropzone.js",
                        "~/Scripts/ThirdParty/pickaday.js",
                        "~/Scripts/ThirdParty/pickaday.jquery.js",
                        "~/Scripts/ThirdParty/jquery.slimscroll.js",
                        "~/Scripts/ThirdParty/powerkiosk_front.js",
                        "~/Scripts/ThirdParty/knockout-2.1.0.js"));

            bundles.Add(new ScriptBundle("~/Enhabit/Common").Include(
                        "~/Scripts/Common/custom_bindings.js"));

            bundles.Add(new ScriptBundle("~/Enhabit/Portal").Include(
                        "~/Scripts/Portal/portal.js"));

            bundles.Add(new ScriptBundle("~/Enhabit/Map").Include(
                        "~/Scripts/EnhabitMap/utilities.js",
                        "~/Scripts/EnhabitMap/index.js",
                        "~/Scripts/EnhabitMap/initialise-functions.js"));

            bundles.Add(new StyleBundle("~/Enhabit/Content/ThirdParty").Include(
                        "~/Content/ThirdParty/bootstrap.css",
                        "~/Content/ThirdParty/bootstrap-theme.css",
                        "~/Content/ThirdParty/owl.carousel.css",
                        "~/Content/ThirdParty/owl.theme.css",
                        "~/Content/ThirdParty/owl.transitions.css",
                        "~/Content/ThirdParty/bootstrap-switch.css",
                        "~/Content/ThirdParty/dropzone.css",
                        "~/Content/ThirdParty/pikaday.css",
                        "~/Content/ThirdParty/msgGrowl.css"));

            bundles.Add(new StyleBundle("~/Enhabit/Content/Map").Include(
                        "~/Content/EnhabitMap/main.css",
                        "~/Content/EnhabitMap/custom.css"));
        }
    }
}