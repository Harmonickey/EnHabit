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
                        Class = "fa-user",
                        Class2 = "fa-book"
                    },
                    new NavLinkViewModel
                    {
                        Name = "Listings",
                        Href = "Portal/Tenant#Listings",
                        Class = "fa-home",
                        Class2 = "fa-th-list"
                    }
                };

            if (hasRental)
            {
                navLinks.Add(new NavLinkViewModel
                {
                    Name = "Payments",
                    Href = "Portal/Tenant#Payments",
                    Class = "fa-usd",
                    Class2 = "fa-usd"
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
    }
}
