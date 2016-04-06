using System.Collections.Generic;

using Enhabit.ViewModels;

namespace Enhabit.Presenter.Commands
{
    public static class NavLinks
    {
        public static IEnumerable<NavLinkViewModel> Tenant(bool hasRental)
        {
            var navLinks =  new List<NavLinkViewModel>
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
                    }
                };

            if (hasRental)
            {
                navLinks.Add(new NavLinkViewModel
                {
                    Name = "Payments",
                    Href = "Portal/Tenant#Payments",
                    Class = "fa-usd"
                });
            }

            return navLinks;
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
                        Name = "Renters",
                        Href = "Portal/Landlord#Renters",
                        Class = "fa-users"
                    }
                };
        }
    }
}
