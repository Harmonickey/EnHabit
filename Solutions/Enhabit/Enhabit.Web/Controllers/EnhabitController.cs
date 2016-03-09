using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Enhabit.ViewModels;
using Enhabit.Presenter;

namespace Enhabit.Web.Controllers
{
    public class EnhabitController : Controller
    {
        private readonly EnhabitMapPresenter Presenter;
        
        public EnhabitController(EnhabitMapPresenter presenter)
        {
            Presenter = presenter;
        }

        /// <summary>
        ///     /Enhabit/Index
        /// </summary>
        /// <returns></returns>

        public ActionResult Index()
        {
            EnhabitMapViewModel vm = new EnhabitMapViewModel
            {
                DefaultListingPicture = "404ImageNotFound.png",
                Listings = new List<ListingViewModel>
                {
                    new ListingViewModel
                    {
                        Price = 1500,
                        Address = "2615 Chestnut Ridge"
                    }
                },
                PriceRange = new PriceRangeViewModel
                {
                    Low = 250,
                    High = 900,
                    Step = 5
                }
            };
            vm = Presenter.GetEnhabitMap();

            // check session in presenter for the user's login status and what they are...
            // then perform the extension method to set the nav links
            // for now we can just control here if they are admin, tenant, or landlord
            vm.NavLinks = GetAdminNavLinks();
            vm.UserLoggedIn = true;

            return View(vm);
        }

        /// <summary>
        /// /Enhabit/SearchForListings
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>

        [HttpPost]
        public JsonResult SearchForListings(SearchQueryViewModel query)
        {
            SearchResultViewModel result = new SearchResultViewModel
            {
                Listings = new List<ListingViewModel>
                {
                    new ListingViewModel
                    {
                        Price = 1500,
                        Address = "2615 Chestnut Ridge"
                    }
                }
            };

            return Json(result, JsonRequestBehavior.DenyGet);
        }

        private IEnumerable<NavLinkViewModel> GetAdminNavLinks()
        {
            return new List<NavLinkViewModel>
                {
                    new NavLinkViewModel
                    {
                        Name = "Analytics",
                        Href = "Portal#Analytics",
                        Class = "fa-bar-chart"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Users",
                        Href = "Portal#Users",
                        Class = "fa-users"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Listings",
                        Href = "Portal#Listings",
                        Class = "fa-home"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Payments",
                        Href = "Portal#Payments",
                        Class = "fa-usd"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Renters",
                        Href = "Portal#Renters",
                        Class = "fa-users"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Universities",
                        Href = "Portal#Universities",
                        Class = "fa-bank"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Pricing",
                        Href = "Portal#Pricing",
                        Class = "fa-money"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Logs",
                        Href = "Portal#Logs",
                        Class = "fa-file-text"
                    }
                };
        }

        /*
        < li class="admin-nav" style="display: none;"><a style = "cursor: pointer;" href="/AnalyticsPortal.php"><i class="fa fa-bar-chart" style="margin-right: 5px;"></i>Analytics</a></li>
            <li class="admin-nav" style="display: none;"><a style = "cursor: pointer;" href="/UsersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Users</a></li>
            <li class="admin-nav" style="display: none;"><a style = "cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>Listings</a></li>
            <li class="admin-nav" style="display: none;"><a style = "cursor: pointer;" href="/PaymentsPortal.php"><i class="fa fa-usd" style="margin-right: 5px;"></i>Payments</a></li>
            <li class="admin-nav" style="display: none;"><a style = "cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-" style="margin-right: 5px;"></i>Renters</a></li>
            <li class="admin-nav" style="display: none;"><a style = "cursor: pointer;" href="/UniversitiesPortal.php"><i class="fa fa-bank" style="margin-right: 5px;"></i>Universities</a></li>
            <li class="admin-nav" style="display: none;"><a style = "cursor: pointer;" href="/PricingPortal.php"><i class="fa fa-money" style="margin-right: 5px;"></i>Pricing</a></li>
            <li class="admin-nav"><a style = "cursor: pointer;" href="/LogsPortal.php"><i class="fa fa-file-text" style="margin-right: 5px;"></i>Logs</a></li>
            <li class="tenant-nav" style="display: none;"><a style = "cursor: pointer;" href="/AccountPortal.php"><i class="fa fa-user" style="margin-right: 5px;"></i>Edit Account</a></li>
            <li class="tenant-nav" style="display: none;"><a style = "cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>My Listing</a></li>
            <li class='rental-nav' style='display: none;'><a style = 'cursor: pointer;' href='/PaymentsPortal.php'><i class='fa fa-usd' style='margin-right: 5px;'></i>My Payments</a></li>
            <li class="landlord-nav" style="display: none;"><a style = "cursor: pointer;" href="/AccountPortal.php"><i class="fa fa-user" style="margin-right: 5px;"></i>My Account</a></li>
            <li class="landlord-nav" style="display: none;"><a style = "cursor: pointer;" href="/ApplicantsPortal.php"><i class="fa fa-copy" style="margin-right: 5px;"></i>My Applicants</a></li>
            <li class="landlord-nav" style="display: none;"><a style = "cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>My Listings</a></li>
            <li class="landlord-nav" style="display: none;"><a style = "cursor: pointer;" href="/EnergyPortal.php"><i class="fa fa-bolt" style="margin-right: 5px;"></i>Save on Energy</a></li>
            <li class="landlord-nav" style="display: none;"><a style = "cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>My Renters</a></li>
*/
    }
}
