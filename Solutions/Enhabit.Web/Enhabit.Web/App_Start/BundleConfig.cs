using System.Web;
using System.Web.Optimization;

namespace Enhabit.Web
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        { 
            /********* SCRIPTS ***********/

            bundles.Add(new ScriptBundle("~/Enhabit/ThirdParty").Include(
                        "~/Scripts/ThirdParty/bootstrap.js",
                        "~/Scripts/ThirdParty/bootstrap-switch.js",
                        "~/Scripts/ThirdParty/owl.carousel.js",
                        "~/Scripts/ThirdParty/jquery.easing.1.3.js",
                        "~/Scripts/ThirdParty/jquery.geocomplete.js",
                        "~/Scripts/ThirdParty/jquery.autoNumeric.js",
                        "~/Scripts/ThirdParty/jquery.slimscroll.js",
                        "~/Scripts/ThirdParty/detectmobilebrowser.js",
                        "~/Scripts/ThirdParty/msgGrowl.js",
                        "~/Scripts/ThirdParty/dropzone.js",
                        "~/Scripts/ThirdParty/powerkiosk_front.js",
                        "~/Scripts/ThirdParty/knockout-3.4.0.js",
                        "~/Scripts/ThirdParty/knockout-2.0.3.validation.js"));

            bundles.Add(new ScriptBundle("~/Portal/ThirdParty").Include(
                        "~/Scripts/ThirdParty/bootstrap.js",
                        "~/Scripts/ThirdParty/bootstrap-switch.js",
                        "~/Scripts/ThirdParty/jquery.geocomplete.js",
                        "~/Scripts/ThirdParty/jquery.autoNumeric.js",
                        "~/Scripts/ThirdParty/msgGrowl.js",
                        "~/Scripts/ThirdParty/jquery.msgbox.js",
                        "~/Scripts/ThirdParty/dropzone.js",
                        "~/Scripts/ThirdParty/knockout-3.4.0.js",
                        "~/Scripts/ThirdParty/knockout-2.0.3.validation.js"));

            bundles.Add(new ScriptBundle("~/Enhabit/Common").Include(
                        "~/Scripts/Common/custom_bindings.js",
                        "~/Scripts/Common/listings.js",
                        "~/Scripts/Common/navLinks.js",
                        "~/Scripts/Common/users.js",
                        "~/Scripts/Common/createListing.js",
                        "~/Scripts/Common/utilities.js"));

            bundles.Add(new ScriptBundle("~/Enhabit/Portal").Include(
                        "~/Scripts/Portal/utilities.js",
                        "~/Scripts/Portal/portal.js"));

            bundles.Add(new ScriptBundle("~/Enhabit/Map").Include(
                        "~/Scripts/EnhabitMap/index.js",
                        "~/Scripts/EnhabitMap/initialise-functions.js"));

            /*********   STYLES *********/

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

            bundles.Add(new StyleBundle("~/Portal/Content/ThirdParty").Include(
                        "~/Content/ThirdParty/bootstrap.css",
                        "~/Content/ThirdParty/bootstra-responsive.css",
                        "~/Content/ThirdParty/bootstrap-switch.css",
                        "~/Content/ThirdParty/dropzone.css",
                        "~/Content/ThirdParty/pikaday.css",
                        "~/Content/ThirdParty/msgGrowl.css",
                        "~/Content/ThirdParty/jquery.msgbox.css",
                        "~/Content/ThirdParty/base-admin-3.css",
                        "~/Content/ThirdParty/base-admin-3-responseive.css",
                        "~/Content/ThirdParty/dashboard.css"));

            bundles.Add(new StyleBundle("~/Portal/Content/Tenant").Include(
                        "~/Content/Portal/Tenant/custom.css"));

            bundles.Add(new StyleBundle("~/Portal/Content/Landlord").Include(
                        "~/Content/Portal/Landlord/custom.css"));
        }
    }
}