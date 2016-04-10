var ListingTabViewModel = function(listingViewModels, parentViewModel)
{
    var self = this;

    self.ListingsActive = ko.observable(false);

    self.Listings = ko.observableArray(ko.utils.arrayMap(listingViewModels, function (listing) {
        return new ListingViewModel(listing, parentViewModel);
    }));

    self.Threshold = parentViewModel.Universities[0].Threshold;
    
    self.ShowCreateListing = ko.observable(true);
    self.ShowUpdateAccountMessage = ko.observable(false);

    self.AfterListingRender = function (element, data)
    {
        parentViewModel.CreateDropzone(data.Id, "[id='" + data.Id + "'] form", data.Images());

        // no knockout custom binding for this yet...
        SetDatePickerTextBox(data.Id);

        parentViewModel.AddedFiles[data.Id] = false;
    };
};

var PaymentTabViewModel = function (paymentViewModel)
{
    var self = this;

    self.PaymentsActive = ko.observable(false);

    self.Address = paymentViewModel.Address;
    self.Unit = paymentViewModel.Unit;
    self.Rent = paymentViewModel.Rent;
    self.LandlordEmail = paymentViewModel.LandlordEmail;
    self.PaymentNote = ko.observable();

    self.FormattedRent = ko.pureComputed(function () {
        return accounting.formatMoney(self.Rent);
    });

    self.NextMonth = paymentViewModel.NextMonth;

    self.CharactersLeft = ko.computed(function () {
        return 100 - self.PaymentNote().length;
    });

    self.PayKey = ko.observable();

    self.PastPayments = ko.observableArray(ko.utils.arrayMap(paymentViewModel.PaymentHistory, function (payment) {
        return new PaymentHistoryViewModel(payment);
    }));
};

var AccountTabViewModel = function (userViewModel, parentViewModel)
{
    var self = this;

    self.AccountActive = ko.observable(false);

    self.Account = new UserViewModel(userViewModel, parentViewModel);
};

var ApplicantTabViewModel = function (applicantViewModels)
{
    var self = this;

    self.ApplicantsActive = ko.observable(false);

    self.Applicants = ko.observableArray(ko.utils.arrayMap(applicantViewModels, function (applicant) {
        return new ApplicantViewModel(applicant);
    }));
};

var RenterTabViewModel = function (renterViewModels)
{
    var self = this;

    self.RentersActive = ko.observable(false);

    self.Renters = ko.observableArray(ko.utils.arrayMap(renterViewModels, function (renter) {
        return new RenterViewModel(renter);
    }));
};

var PortalViewModel = function (portalViewModel)
{
    var self = this;
    
    self.Landlords = portalViewModel.Landlords;
    self.Universities = portalViewModel.Universities;

    self.AccountTab = new AccountTabViewModel(portalViewModel.Account, self);

    self.ListingTab = new ListingTabViewModel(portalViewModel.Listings, self);

    if (portalViewModel.Applicants)
    {
        self.ApplicantTab = new ApplicantTabViewModel(portalViewModel.Applicants);
    }
    if (portalViewModel.Payments)
    {
        self.PaymentTab = new PaymentTabViewModel(portalViewModel.Payments);
    }
    if (portalViewModel.Renters)
    {
        self.RenterTab = new RenterTabViewModel(portalViewModel.Renters);
    }

    self.CreateListingPictureGuid = portalViewModel.CreateListingPictureGuid;
    self.CreateListingUserGuid = ko.observable(self.AccountTab.Account.Id());

    self.CreateListingButtonEnabled = ko.observable(true);
    self.CreateListingButtonText = ko.observable("Create Listing");

    self.Dropzones = {};
    self.NumAdded = {};
    self.NumUploaded = {};

    self.Pictures = {};
    self.AddedFiles = {};

    self.PendingUpdateListingData = ko.observable();
    self.PendingListingData = ko.observable();

    self.CreateListing = new CreateListingViewModel(self.Landlords, self.Universities, self);

    if (location.hash == "")
    {
        location.hash = "#Listings";
    }

    self.InitHash = location.hash.replace("#", "");

    /****** Methods ******/

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
            case "Account": // landlord and tenant
                self.AccountTab.AccountActive(true);
                self.ListingTab.ListingsActive(false);
                if (self.PaymentTab)
                {
                    self.PaymentTab.PaymentsActive(false);
                }
                if (self.ApplicantTab)
                {
                    self.ApplicantTab.ApplicantsActive(false);
                }
                if (self.RenterTab)
                {
                    self.RenterTab.RentersActive(false);
                }
                break;
            case "Listings": // landlord and tenant
                self.AccountTab.AccountActive(false);
                self.ListingTab.ListingsActive(true);
                if (self.PaymentTab)
                {
                    self.PaymentTab.PaymentsActive(false);
                }
                if (self.ApplicantTab)
                {
                    self.ApplicantTab.ApplicantsActive(false);
                }
                if (self.RenterTab)
                {
                    self.RenterTab.RentersActive(false);
                }
                break;
            case "Payments": // tenant only
                self.AccountTab.AccountActive(false);
                self.ListingTab.ListingsActive(false);
                self.PaymentTab.PaymentsActive(true);
                break;
            case "Applicants": // landlord only
                self.AccountTab.AccountActive(false);
                self.ListingTab.ListingsActive(false);
                self.ApplicantTab.ApplicantsActive(true);
                self.RenterTab.RentersActive(false);
                break;
            case "Renters": // landlord only
                self.AccountTab.AccountActive(false);
                self.ListingTab.ListingsActive(false);
                self.ApplicantTab.ApplicantsActive(false);
                self.RenterTab.RentersActive(true);
                break;
        }
    };

    self.CreateDropzone = function(key, element, existingPics)
    {
        self.Dropzones[key] = new Dropzone(element,
        {
            addRemoveLinks: true,
            autoProcessQueue: false
        });

        var myDropzone = self.Dropzones[key];
        self.NumAdded[key] = 0;
        self.NumUploaded[key] = 0;

        myDropzone.on("success", function (file)
        {
            if (self.NumUploaded[key] == self.NumAdded[key] - 1)
            {
                self.NumUploaded[key] = 0;
                self.NumAdded[key] = 0;
                $(".dz-progress").remove();
                self.ProcessListing();
            }
            else
            {
                self.NumUploaded[key] += 1;
                $(".dz-progress").remove();
            }
        });

        myDropzone.on("addedfile", function (file)
        {
            if (self.Pictures[key] == null)
            {
                self.Pictures[key] = [];
            }
            var listing = self.GetListingById(key);

            var filename = (file.alreadyUploaded
                            ? file.name
                            : (key == "create" || listing == null ? self.CreateListingPictureGuid : listing.PicturesId) + "_" + file.name);

            self.Pictures[key].push(filename);

            if (!file.alreadyUploaded)
            {
                this.files[this.files.length - 1].serverFileName = filename;
            }

            self.AddedFiles[key] = true;

            self.NumAdded[key] += 1;
        });

        myDropzone.on("removedfile", function (file)
        {
            var index = this.files.indexOf(file);

            if (self.Pictures[key] == null)
            {
                self.Pictures[key] = [];
            }

            self.Pictures[key].splice(index, 1);

            self.NumAdded[key] -= 1;

            if (self.NumAdded[key] <= 0)
            {
                self.AddedFiles[key] = false;
                self.NumAdded[key] = 0;
            }
        });

        if (existingPics != null)
        {
            for (var i = 0; i < existingPics.length; i++)
            {
                var mockFile = { name: existingPics[i], alreadyUploaded: true };

                myDropzone.emit("addedfile", mockFile);
                self.NumAdded[key] -= 1; // these files need to be tracked, but technically we cannot count them as "added" files
                myDropzone.emit("thumbnail", mockFile, mockFile.name);
                myDropzone.emit("complete", mockFile);
            }
        }
    };

    self.ProcessListing = function ()
    {
        if (self.PendingListingData() == undefined && self.PendingUpdateListingData() == undefined)
        {
            return;
        }

        if (self.PendingListingData() != undefined)
        {
            self.PendingListingData().PicturesId = self.CreateListingPictureGuid;
            self.PendingListingData().UserId = self.CreateListingUserGuid();

            var data = ko.toJSON(self.PendingListingData());

            $.ajax(
            {
                type: "POST",
                url: "/Listing/Create",
                data: data,
                dataType: "json",
                contentType: "application/json charset=utf-8",
                beforeSend: function()
                {
                    self.CreateListingButtonEnabled(false);
                    self.CreateListingButtonText("Creating...");
                },
                success: function (res)
                {
                    try
                    {
                        if (res == false)
                        {
                            throw new Error("Unable to Create Listing");
                        }
                        else
                        {
                            var listing = new ListingViewModel(res, self);

                            self.ListingTab.Listings.push(listing);

                            $.msgGrowl({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'top-center' });
                        }
                    }
                    catch (e)
                    {
                        $.msgGrowl({ type: 'error', title: 'Error', text: e.message, position: 'top-center' });
                    }
                },
                error: function (res, err)
                {
                    $.msgGrowl({ type: 'error', title: 'Error', text: res, position: 'top-center' });
                },
                complete: function ()
                {
                    self.CreateListingButtonEnabled(true);
                    self.CreateListingButtonText("Create Listing");
                    self.NumUploaded["create"] = 0;
                    self.NumAdded["create"] = 0;
                    self.AddedFiles["create"] = false;

                    self.PendingListingData(undefined);

                    self.Dropzones["create"].destroy();

                    $("#createListingModal").modal('hide');

                    self.ListingTab.ShowCreateListing(false);
                    self.ListingTab.ShowListingMessage(true);

                    self.CreateDropzone("create", "#modal-content-listing form");
                }
            });
        }
        else if (self.PendingUpdateListingData() != undefined)
        {
            var data = ko.toJSON(self.PendingUpdateListingData());

            $.ajax(
            {
                type: "POST",
                url: "/Listing/Update",
                data: data,
                dataType: "json",
                contentType: "application/json charset=utf-8",
                success: function (res)
                {
                    try
                    {
                        if (res == false)
                        {
                            throw new Error("Problem Updating Listing");
                        }
                        else
                        {
                            var listing = self.GetListingById(data.ListingId);

                            listing = new ListingViewModel(res, self);
                        }
                    }
                    catch (e)
                    {
                        $.msgGrowl({ type: 'error', title: 'Error', text: e.message, position: 'top-center' });
                    }
                },
                error: function (res, err)
                {
                    $.msgGrowl({ type: 'error', title: 'Error', text: res, position: 'top-center' });
                },
                complete: function ()
                {
                    self.NumUploaded[self.PendingUpdateListingData().ListingId] = 0;
                    self.AddedFiles[self.PendingUpdateListingData().ListingId] = false;
                    var listing = self.GetListingById(self.PendingUpdateListingData().ListingId);
                    listing.UpdateListingButtonEnabled(true);
                    listing.UpdateListingButtonText("Update");
                    $("a[href='#" + self.PendingUpdateListingData().ListingId + "'").click();
                    self.PendingUpdateListingData(undefined);
                }
            });
        }
    };

    self.GetListingById = function(id)
    {
        for (var i = 0; i < self.ListingTab.Listings().length; i++)
        {
            // find the listing we were just updating
            if (self.ListingTab.Listings()[i].Id == id)
            {
                // just reassign it the new view model
                return self.ListingTab.Listings()[i];
            }
        }

        return null;
    }

    /****** Initialization Calls ******/

    self.TabActive(self.InitHash);

    $.each(self.NavLinks(), function (index, navLink) {
        var tab = navLink.LinkHref.split("#")[1];
        if (tab == self.InitHash) {
            navLink.Selected(true);
        }
    });

    self.CreateDropzone("create", "#createListingModal form");
};

