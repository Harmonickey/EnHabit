var ListingTabViewModel = function(listingViewModels)
{
    var self = this;

    self.ListingsActive = ko.observable(false);

    self.Listings = ko.observableArray(ko.utils.arrayMap(listingViewModels, function (listing) {
        return new ListingViewModel(listing);
    }));
    
    self.ShowCreateListing = ko.observable(true);
    self.ShowUpdateAccountMessage = ko.observable(false);
    self.ShowListingMessage = ko.observable(true);
};

var PaymentTabViewModel = function (paymentViewModels)
{
    var self = this;

    self.PaymentsActive = ko.observable(false);

    self.Address = ko.observable();
    self.Unit = ko.observable();
    self.FormattedRent = ko.observable();
    self.LandlordEmail = ko.observable();
    self.PaymentNote = ko.observable();
    self.NextMonth = ko.observable();
    self.CharactersLeft = ko.observable();
    self.PayKey = ko.observable();

    self.PastPayments = ko.observableArray(ko.utils.arrayMap(paymentViewModels, function (payment) {
        return new PaymentViewModel(payment);
    }));
};

var AccountTabViewModel = function (userViewModel)
{
    var self = this;

    self.AccountActive = ko.observable(false);

    self.Account = new UserViewModel(userViewModel);
};

var PortalViewModel = function (userViewModel, listingViewModels, navLinkViewModel, landlords, universities, paymentViewModels)
{
    var self = this;

    self.AccountTab = new AccountTabViewModel(userViewModel);
    self.ListingTab = new ListingTabViewModel(listingViewModels);
    self.PaymentTab = new PaymentTabViewModel(paymentViewModels);

    self.NavLinks = ko.computed(function () {
        return ko.utils.arrayMap(navLinkViewModel, function (navLink) {
            return new NavLinkViewModel(navLink);
        });
    });

    self.ChangeTab = function(navLink)
    {
        $.each(self.NavLinks(), function(index, link) {
            link.Selected(false);
        });

        var tab = navLink.LinkHref.split("#")[1];
        navLink.Selected(true);

        self.TabActive(tab);
    };

    self.TabActive = function(tab)
    {
        switch (tab) {
            case "Account":
                self.AccountTab.AccountActive(true);
                self.ListingTab.ListingsActive(false);
                self.PaymentTab.PaymentsActive(false);
                break;
            case "Listings":
                self.AccountTab.AccountActive(false);
                self.ListingTab.ListingsActive(true);
                self.PaymentTab.PaymentsActive(false);
                break;
            case "Payments":
                self.AccountTab.AccountActive(false);
                self.ListingTab.ListingsActive(false);
                self.PaymentTab.PaymentsActive(true);
                break;
        }
    };

    self.Landlords = landlords;
    self.Universities = universities;

    self.CreateListing = new CreateListingViewModel(landlords, universities, self);

    self.LogoutUser = function ()
    {
        $.ajax(
        {
            type: "POST",
            url: "/User/Logout",
            success: function (res)
            {
                if (res == true)
                {
                    $.msgGrowl({ type: 'warning', title: 'Warning', text: "User Logged Out Successfully.", position: 'top-center' });
                    self.UserLoggedIn(false);
                }
                else
                {
                    $.msgGrowl({ type: 'error', title: 'Error', text: "Problem Logging Out", position: 'top-center' });
                }
            },
            error: function ()
            {
                $.msgGrowl({ type: 'error', title: 'Error', text: "Problem Logging Out", position: 'top-center' });
            }
        });
    };

    self.InitHash = location.hash.replace("#", "");

    self.TabActive(self.InitHash);

    $.each(self.NavLinks(), function (index, navLink) {
        var tab = navLink.LinkHref.split("#")[1];
        if (tab == self.InitHash)
        {
            navLink.Selected(true);
        }
    });
};

