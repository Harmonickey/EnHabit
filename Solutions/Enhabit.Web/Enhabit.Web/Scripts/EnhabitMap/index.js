var UserViewModel = function(user)
{
    var self = this;

    self.Username = ko.observable();
    self.Password = ko.observable();
    self.ConfirmPassword = ko.observable();
    self.Email = ko.observable();
    self.PhoneNumber = ko.observable();
    self.FirstName = ko.observable();
    self.LastName = ko.observable();

};

var NavLinkViewModel = function (navLink)
{
    var self = this;

    self.LinkHref = navLink.Href;
    self.LinkName = navLink.Name;
    self.LinkClass = navLink.Class;
    self.GetClass = ko.pureComputed(function () {
        return self.LinkClass;
    });
};

var SearchQueryViewModel = function (priceRange)
{
    var self = this;
    
    self.PriceRangeLow = ko.observable(priceRange.Low);
    self.PriceRangeHigh = ko.observable(priceRange.High);
    self.Step = priceRange.Step;

    self.AmountText = ko.computed(function ()
    {
        return "$" + self.PriceRangeLow() + " - $" + self.PriceRangeHigh();
    });

    self.StartDate = ko.observable("MM/DD/YYYY");
    self.Bedrooms = ko.observable();
    self.Bathrooms = ko.observable();
    self.Parking = ko.observable();
    self.Animals = ko.observable();
    self.Laundry = ko.observable();
    self.AirConditioning = ko.observable();
    self.LeaseType = ko.observable();
    self.BuildingType = ko.observable();
    
    // Init the Price Range Slider
    $("#PriceRangeSlider").slider(
    {
        range: true,
        min: self.PriceRangeLow(),
        max: self.PriceRangeHigh(),
        step: self.Step,
        values: [self.PriceRangeLow(), self.PriceRangeHigh()],
        slide: function (event, ui) {
            self.PriceRangeLow(ui.values[0]);
            self.PriceRangeHigh(ui.values[1]);
        }
    });
};

var CreateListingViewModel = function (landlords, universities)
{
    var self = this;

    self.Address = ko.observable();
    self.Unit = ko.observable();
    self.Rent = ko.observable();
    self.StartDate = ko.observable();
    self.Bedrooms = ko.observable();
    self.Bathrooms = ko.observable();
    self.Parking = ko.observable();
    self.Animals = ko.observable();
    self.Laundry = ko.observable();
    self.AirConditioning = ko.observable();
    self.LeaseType = ko.observable();
    self.BuildingType = ko.observable();

    self.Landlords = landlords;
    self.Universities = universities;

    self.Landlord = ko.observable();
    self.University = ko.observable();
    self.Notes = ko.observable();

    self.PendingListingCreation = function ()
    {

    };
};

var EnhabitMapViewModel = function (enhabitMapData)
{
    var self = this;

    self.DefaultPicture = enhabitMapData.DefaultListingPicture;
    
    // search bar
    self.SearchBar = new SearchQueryViewModel(enhabitMapData.PriceRange);
   
    

    self.Dropzones = {};
    self.NumAdded = ko.observable(0);
    self.NumUploaded = ko.observable(0);
    self.PendingData = ko.observable(null);
    self.Pictures = ko.observable();
    self.AddedFiles = ko.observable();
    self.Markers = new L.FeatureGroup();

    self.Landlords = enhabitMapData.Landlords;
    self.Universities = enhabitMapData.Universities;

    self.UserLoggedIn = ko.observable(enhabitMapData.UserLoggedIn);

    self.User = new UserViewModel(enhabitMapData.User);

    self.ExtraFiltersBtnText = ko.observable("Open Extra Filters");

    self.NavLinks = ko.utils.arrayMap(enhabitMapData.NavLinks, function (navLink) {
        return new NavLinkViewModel(navLink);
    });

    L.mapbox.accessToken = 'pk.eyJ1IjoiaGFybW9uaWNrZXkiLCJhIjoiZmM4MGM0Mjk0NmJmMDFjMmY3YWY1NmUxMzllMzc5NGYifQ.hdx-TOA4rtQibXkpdLQK4g';
    self.Map = L.mapbox.map('map', 'mapbox.streets', { zoomControl: false }).setView([42.057, -87.680], 15);

    self.OpenPostListingModal = function (data, event)
    {
        LoadModal(event, 'modal-content-listing', 'listing', 'Post Listing');
        self.CreateDropzone("create", "#common-modal form");
        InitSpecialFields();
        ko.applyBindings(new CreateListingViewModel(self.Landlords, self.Universities), $("#common-modal")[0]);
    };

    self.OpenPowerKioskModal = function(data, event)
    {
        LoadModal(event, 'modal-content-power-kiosk', 'power-kiosk', 'Power Kiosk');
        InitializePowerKiosk();
    };

    self.ToggleExtrasView = function ()
    {
        if (self.IsExtrasViewOpen())
        {
            $("#extras").fadeOut(200, function ()
            {
                $("#extras_view").animate(
                {
                    width: "0px",
                    paddingLeft: "0px",
                    paddingRight: "0px"
                }, 300, function () {
                    self.ExtraFiltersBtnText("Open Extra Filters");
                });
            });
        }
        else
        {
            $("#extras_view").animate(
            {
                width: parseFloat($("#left-sidebar").css("width")),
                paddingLeft: "5px",
                paddingRight: "5px"
            },
            {
                duration: 300,
                easing: 'easeInOutCubic',
                done: function () {
                    $("#extras").fadeIn(200);
                    self.ExtraFiltersBtnText("Close Extra Filters");
                }
            });
        }

        self.IsExtrasViewOpen(!self.IsExtrasViewOpen());
    };

    self.CreateDropzone = function(key, element, existingPics)
    {
        self.Dropzones[key] = new Dropzone(element,
        {
            addRemoveLinks: true,
            autoProcessQueue: false
        });

        var myDropzone = self.Dropzones[key];

        myDropzone.on("success", function (file) {
            if (numUploaded == numAdded - 1) {
                numUploaded = 0;
                numAdded = 0;
                $(".dz-progress").remove();
                self.ProcessListing();
            }
            else {
                numUploaded++;
                $(".dz-progress").remove();
            }
        });

        myDropzone.on("addedfile", function (file) {
            var oid = $(this.element).data("pic-id");
            if (pictures[oid] == null) {
                pictures[oid] = [];
            }
            var filename = (file.alreadyUploaded
                            ? file.name
                            : (file.name.split(".").length > 1 ? file.name.split(".")[0] + "_" + Math.random().toString(36).slice(2) + "." + file.name.split(".")[file.name.split(".").length - 1]
                                                                : Math.random().toString(36).slice(2) + "_" + file.name));
            pictures[oid].push(filename);

            if (!file.alreadyUploaded) {
                this.files[this.files.length - 1].serverFileName = filename;
            }

            self.AddedFiles()[oid] = true;

            self.NumAdded(self.NumAdded() + 1);
        });

        myDropzone.on("removedfile", function (file) {
            var index = this.files.indexOf(file);

            var oid = $(this.element).data("pic-id");
            if (self.Pictures()[oid] == null) {
                self.Pictures()[oid] = [];
            }

            self.Pictures()[oid].splice(index, 1);

            self.NumAdded(self.NumAdded() - 1);

            if (numAdded < 0) {
                self.AddedFiles()[oid] = false;
                self.NumAdded(0);
            }
        });

        if (existingPics != null) {
            for (var i = 0; i < existingPics.length; i++) {
                var mockFile = { name: existingPics[i], alreadyUploaded: true };

                myDropzone.emit("addedfile", mockFile);
                self.NumAdded(self.NumAdded() - 1);
                myDropzone.emit("thumbnail", mockFile, "/images/enhabit/images/" + mockFile.name);
                myDropzone.emit("complete", mockFile);
            }
        }
    }

    self.LoginUser = function () 
    {
        var data = ko.toJSON({
            Username: self.User.Username(),
            Password: self.User.Password()
        });

        $.ajax(
        {
            type: "POST",
            url: "/User/Login",
            data:
            {
                data: data,
            },
            beforeSend: function()
            {
                DisableModalSubmit('login');
            },
            success: function(res)
            {
                try
                {
                    if (Contains(res, "Okay"))
                    {
                        ShowLoginFeatures(hideMainModal, res);
                        
                        // session should be set, so the user will be attached to the listing
                        if (listingWaiting)
                        {
                            CreateListing();
                        }
                    }
                    else
                    {
                        throw new Error(res);
                    }
                }
                catch(e)
                {
                    SetError('login', "Incorrect User/Password Combination.");
                }
            },
            error: function(res, err)
            {
                SetError('login', res);
            },
            complete: function()
            {
                ResetModal("login", "Log In", false);
            }
        });
    };

    self.LogoutUser = function () {

    };

    self.SearchForListings = function () {

    };
};

ko.bindingHandlers.stopBinding = {
    init: function () {
        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings.stopBinding = true;