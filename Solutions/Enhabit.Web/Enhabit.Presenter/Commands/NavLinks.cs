using System.Collections.Generic;

using Enhabit.ViewModels;

namespace Enhabit.Presenter.Commands
{
    public static class NavLinks
    {
        public static IEnumerable<NavLinkViewModel> Tenant()
        {
            return new List<NavLinkViewModel>
                {
                    new NavLinkViewModel
                    {
                        Name = "Account",
                        Href = "Portal/Tenant#Account",
                        Class = "fa-user"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Listings",
                        Href = "Portal/Tenant#Listings",
                        Class = "fa-home"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Payment",
                        Href = "Portal/Tenant#Payments",
                        Class = "fa-usd"
                    }
                };
        }

        public static IEnumerable<NavLinkViewModel> Landlord()
        {
            return new List<NavLinkViewModel>
                {
                    new NavLinkViewModel
                    {
                        Name = "Account",
                        Href = "Portal/Landlord#Account",
                        Class = "fa-user"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Applicants",
                        Href = "Portal/Landlord#Applicants",
                        Class = "fa-copy"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Listings",
                        Href = "Portal/Landlord#Listings",
                        Class = "fa-home"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Energy",
                        Href = "Portal/Landlord#Energy",
                        Class = "fa-bolt"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Renters",
                        Href = "Portal/Landlord#Renters",
                        Class = "fa-users"
                    }
                };
        }

        public static IEnumerable<NavLinkViewModel> Admin()
        {
            return new List<NavLinkViewModel>
                {
                    new NavLinkViewModel
                    {
                        Name = "Analytics",
                        Href = "Portal/Admin#Analytics",
                        Class = "fa-bar-chart"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Users",
                        Href = "Portal/Admin#Users",
                        Class = "fa-users"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Listings",
                        Href = "Portal/Admin#Listings",
                        Class = "fa-home"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Payments",
                        Href = "Portal/Admin#Payments",
                        Class = "fa-usd"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Renters",
                        Href = "Portal/Admin#Renters",
                        Class = "fa-users"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Universities",
                        Href = "Portal/Admin#Universities",
                        Class = "fa-bank"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Pricing",
                        Href = "Portal/Admin#Pricing",
                        Class = "fa-money"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Logs",
                        Href = "Portal/Admin#Logs",
                        Class = "fa-file-text"
                    }
                };
        }
    }
}
