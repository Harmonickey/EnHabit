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

var PortalViewModel = function (portalViewModel)
{
    var self = this;
    
    self.AccountTab = new AccountTabViewModel(portalViewModel.Account);
    self.ListingTab = new ListingTabViewModel(portalViewModel.Listings);
    self.PaymentTab = new PaymentTabViewModel(portalViewModel.Payments);

    self.CreateListingPictureGuid = portalViewModel.CreateListingPictureGuid;
    self.CreateListingUserGuid = ko.observable();

    self.Dropzones = {};
    self.NumAdded = ko.observable(0);
    self.NumUploaded = ko.observable(0);
    self.Pictures = {};
    self.AddedFiles = {};

    self.NavLinks = ko.computed(function () {
        return ko.utils.arrayMap(portalViewModel.NavLinks, function (navLink) {
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

    self.Landlords = portalViewModel.Landlords;
    self.Universities = portalViewModel.Universities;

    self.CreateListing = new CreateListingViewModel(self.Landlords, self.Universities, self);

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

    self.CreateDropzone(key, element, existingPics)
    {
        self.Dropzones[key] = new Dropzone(element,
        {
            addRemoveLinks: true,
            autoProcessQueue: false
        });

        var myDropzone = self.Dropzones[key];

        myDropzone.on("success", function (file)
        {
            if (self.NumUploaded() == self.NumAdded() - 1)
            {
                self.NumUploaded(0);
                self.NumAdded(0);
                $(".dz-progress").remove();
                self.ProcessListing();
            }
            else
            {
                self.NumUploaded(self.NumUploaded() + 1);
                $(".dz-progress").remove();
            }
        });

        myDropzone.on("addedfile", function (file) {
            var oid = $(this.element).data("pic-id");
            if (self.Pictures[oid] == null) {
                self.Pictures[oid] = [];
            }
            var filename = (file.alreadyUploaded
                            ? file.name
                            : self.CreateListingPictureGuid + "_" + file.name);

            self.Pictures[oid].push(filename);

            if (!file.alreadyUploaded)
            {
                this.files[this.files.length - 1].serverFileName = filename;
            }

            self.AddedFiles[oid] = true;

            self.NumAdded(self.NumAdded() + 1);
        });

        myDropzone.on("removedfile", function (file) {
            var index = this.files.indexOf(file);

            var oid = $(this.element).data("pic-id");
            if (self.Pictures[oid] == null) {
                self.Pictures[oid] = [];
            }

            self.Pictures[oid].splice(index, 1);

            self.NumAdded(self.NumAdded() - 1);

            if (self.NumAdded() < 0) {
                self.AddedFiles[oid] = false;
                self.NumAdded(0);
            }
        });

        if (existingPics != null)
        {
            for (var i = 0; i < existingPics.length; i++)
            {
                var mockFile = { name: existingPics[i], alreadyUploaded: true };

                myDropzone.emit("addedfile", mockFile);
                self.NumAdded(self.NumAdded() - 1);
                myDropzone.emit("complete", mockFile);
            }
        }
    };

    self.CreateDropzone("create", "#createListingModal form");
};

