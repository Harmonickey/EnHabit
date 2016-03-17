var ListingViewModel = function (listing) {
    var self = this;

    self.XCoordinate = listing.XCoordinate;
    self.YCoordinate = listing.YCoordinate;
    self.IsFeatured = listing.IsFeatured;
    self.Testing = listing.Testing;
    self.Address = listing.Address;
    self.Unit = listing.Unit;
    self.Price = listing.Price;
    self.Images = listing.Images;
    self.Thumbnails = listing.Thumbnails;
};

var UserViewModel = function (user, enhabitMapViewModel)
{
    var self = this;

    self.Username = ko.observable();
    self.Password = ko.observable();
    self.ConfirmPassword = ko.observable();
    self.Email = ko.observable();
    self.PhoneNumber = ko.observable();
    self.FirstName = ko.observable();
    self.LastName = ko.observable();

    self.LoginEnabled = ko.observable(true);
    self.LoginError = ko.observable();
    self.LoginErrorVisible = ko.observable(false);

    self.CreateAccountEnabled = ko.observable(true);
    self.CreateAccountError = ko.observable();
    self.CreateAccountErrorVisible = ko.observable(false);

    self.OpenRegisterModal = function () {
        CleanModalViewModel();
        enhabitMapViewModel.OpenRegisterModal();
    };

    self.LoginUser = function () {
        var data = ko.toJSON({
            Username: self.Username(),
            Password: self.Password()
        });

        $.ajax(
        {
            type: "POST",
            url: "/User/Login",
            data: data,
            dataType: "json",
            contentType: "application/json charset=utf-8",
            beforeSend: function ()
            {
                self.LoginEnabled(false);
                self.LoginErrorVisible(false);
            },
            success: function (res)
            {
                try
                {
                    if (res != false)
                    {
                        $.msgGrowl({ type: 'success', title: 'Success', text: "User Logged In Successfully!", position: 'top-center' });

                        enhabitMapViewModel.ShowLoginNav(true);
                    }
                    else
                    {
                        throw new Error(res);
                    }
                }
                catch (e)
                {
                    self.LoginError("Incorrect User/Password Combination.");
                    self.LoginErrorVisible(true);
                }
            },
            error: function (res, err)
            {
                self.LoginError(res);
                self.LoginErrorVisible(true);
            },
            complete: function ()
            {
                self.LoginEnabled(false);
            }
        });
    };

    self.LoginFacebook = function ()
    {
        try
        {
            // this calls and responds to the facebook popup
            FB.login(function (response)
            {
                if (response.status === 'connected')
                {
                    //we are good to login!
                    var userId = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                    self.Username(userId);
                    self.Password(accessToken);
                    self.LoginUser();
                }
            });
        }
        catch (e)
        {
            $.msgGrowl({ type: 'error', title: 'Error', text: "Problem with Logging In", position: 'top-center' });
        }
    };

    self.CreateAccount = function()
    {
        var data = ko.toJSON({
            Username: self.Username(),
            Password: self.Password(),
            ConfirmPassword: self.ConfirmPassword(),
            FirstName: self.FirstName(),
            LastName: self.LastName(),
            Email: self.Email(),
            PhoneNumber: self.PhoneNumber()
        });

        $.ajax(
        {
            type: "POST",
            url: "/User/Create",
            data: data,
            dataType: "json",
            contentType: "application/json charset=utf-8",
            beforeSend: function () {
                self.CreateAccountEnabled(false);
                self.CreateAccountErrorVisible(false);
            },
            success: function (res)
            {
                try
                {
                    if (res != false)
                    {
                        enhabitMapViewModel.ShowLoginNav(true);

                        $.msgGrowl({ type: 'success', title: 'Success', text: "User Created Successfully!", position: 'top-center' });
                        $.msgGrowl({ type: 'success', title: 'Success', text: "User Logged In Successfully!", position: 'top-center' });

                        // session should be set, so the user will be attached to the listing
                        if (enhabitMapViewModel.PendingListingData() != undefined)
                        {
                            enhabitMapViewModel.CreateListing(res);
                        }
                    }
                    else
                    {
                        throw new Error(res);
                    }
                }
                catch (e)
                {
                    self.CreateAccountError(e.message);
                    self.CreateAccountErrorVisible(true);
                }
            },
            error: function (res, err)
            {
                self.CreateAccountError(res);
                self.CreateAccountErrorVisible(true);
            },
            complete: function ()
            {
                self.CreateAccountEnabled(false);
            }
        });
    };
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

var CreateListingViewModel = function (landlords, universities, enhabitMapViewModel)
{
    var self = this;

    self.errors = ko.validation.group(self, { deep: true, live: true });

    self.Address = ko.observable().extend({
        required: true
    });
    self.Unit = ko.observable();
    self.Rent = ko.observable().extend({
        required: true
    });
    self.StartDate = ko.observable().extend({
        required: true
    });
    self.Bedrooms = ko.observable();
    self.Bathrooms = ko.observable();
    self.Parking = ko.observable();
    self.Animals = ko.observable();
    self.Laundry = ko.observable();
    self.AirConditioning = ko.observable();
    self.LeaseTypes = ko.observable();
    self.BuildingTypes = ko.observable();
    self.Landlords = landlords;
    self.Universities = universities;

    self.Landlord = ko.observable();
    self.University = ko.observable();
    self.LeaseType = ko.computed(function () {
        return self.LeaseTypes() == true ? "rental" : "sublet";
    });
    self.BuildingType = ko.computed(function () {
        return self.BuildingTypes() == true ? "apartment" : "house";
    });
    self.FormattedAddress = ko.computed(function () {
        return (self.Address() ? self.Address().split(",")[0] : "");
    });
    self.FormattedStartDate = ko.computed(function () {
        return (self.StartDate() ? $.datepicker.formatDate('mm/dd/yy', new Date(self.StartDate())) : "");
    });
    self.Pictures = ko.observable();

    self.Notes = ko.observable();

    self.PendingListingCreation = function ()
    {
        self.errors.showAllMessages();

        if (self.errors().length == 0)
        {
            var data = {
                Address: self.FormattedAddress(),
                Unit: self.Unit(),
                Rent: self.Rent(),
                StartDate: self.FormattedStartDate(),
                Bedrooms: self.Bedrooms(),
                Bathrooms: self.Bathrooms(),
                Parking: self.Parking(),
                Animals: self.Animals(),
                Laundry: self.Laundry(),
                AirConditioning: self.AirConditioning(),
                LeaseType: self.LeaseType(),
                BuildingType: self.BuildingType(),
                Landlord: self.Landlord(),
                University: self.University(),
                Pictures: self.Pictures(),
                Note: self.Notes()
            };

            // setup the listing data for pending 
            enhabitMapViewModel.PendingListingData(data);

            CleanModalViewModel();
            enhabitMapViewModel.OpenRegisterModal();
        }
    };
};

var EnhabitMapViewModel = function (enhabitMapData)
{
    var self = this;

    self.DefaultPicture = enhabitMapData.DefaultListingPicture;
    self.CreateListingPictureGuid = enhabitMapData.CreateListingPictureGuid;
    self.CreateListingUserGuid = ko.observable();

    // search bar
    self.SearchBar = new SearchQueryViewModel(enhabitMapData.PriceRange);
   
    self.PendingListingData = ko.observable();

    self.Dropzones = {};
    self.NumAdded = ko.observable(0);
    self.NumUploaded = ko.observable(0);
    self.Pictures = {};
    self.AddedFiles = {};
    self.Markers = new L.FeatureGroup();

    self.Landlords = enhabitMapData.Landlords;
    self.Universities = enhabitMapData.Universities;

    self.UserLoggedIn = ko.observable(enhabitMapData.UserLoggedIn);

    self.User = new UserViewModel(enhabitMapData.User);

    self.ExtraFiltersBtnText = ko.observable("Open Extra Filters");

    self.IsExtrasViewOpen = ko.observable(false);

    self.NavLinks = ko.observableArray(ko.utils.arrayMap(enhabitMapData.NavLinks, function (navLink) {
        return new NavLinkViewModel(navLink);
    }));

    L.mapbox.accessToken = 'pk.eyJ1IjoiaGFybW9uaWNrZXkiLCJhIjoiZmM4MGM0Mjk0NmJmMDFjMmY3YWY1NmUxMzllMzc5NGYifQ.hdx-TOA4rtQibXkpdLQK4g';
    self.Map = L.mapbox.map('map', 'mapbox.streets', { zoomControl: false }).setView([42.057, -87.680], 15);

    self.OpenPostListingModal = function (data, event)
    {
        if (self.UserLoggedIn())
        {
            window.location = "/Portal#Listings";
        }

        LoadModal(event, 'modal-content-listing', 'listing', 'Post Listing');
        self.CreateDropzone("create", "#common-modal form");
        InitSpecialFields();
        ko.applyBindings(new CreateListingViewModel(self.Landlords, self.Universities, self), $("#common-modal")[0]);
    };

    self.OpenPowerKioskModal = function(data, event)
    {
        LoadModal(event, 'modal-content-power-kiosk', 'power-kiosk', 'Power Kiosk');
        InitializePowerKiosk();
    };

    self.OpenLoginModal = function (data, event)
    {
        LoadModal(event, 'modal-content-login', 'login', 'Log In');
        ko.applyBindings(new UserViewModel(null, self), $("#common-modal")[0]);
    };

    self.OpenRegisterModal = function (data, event) 
    {
        LoadModal(event, 'modal-content-register', 'CreateAccount', 'Create an Account');
        ko.applyBindings(new UserViewModel(null, self), $("#common-modal")[0]);
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

    self.CreateDropzone = function (key, element, existingPics)
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

        myDropzone.on("addedfile", function (file)
        {
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

        myDropzone.on("removedfile", function (file)
        {
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

    self.ProcessListing = function()
    {
        if (self.PendingListingData() == undefined)
        {
            return;
        }

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
            success: function (res) {
                try {
                    if (!res) {
                        throw new Error("Unable to Create Listing");
                    }
                    else {
                        
                        var listing = new ListingViewModel(res);

                        self.CreateMarker(listing);

                        self.NumUploaded(0);

                        self.PendingListingData(undefined);

                        $.msgGrowl({ type: 'success', title: 'Success', text: "Listing Created Successfully!", position: 'top-center' }); 
                    }
                }
                catch (e) {
                    $.msgGrowl({ type: 'error', title: 'Error', text: e.message, position: 'top-center' });
                }
            },
            error: function (res, err) {
                $.msgGrowl({ type: 'error', title: 'Error', text: res, position: 'top-center' });
            },
            complete: function () {
                $("#create-listing-button").prop("disabled", false);
                $("#create-listing-button").text("Create Listing");

                self.Dropzones["create"].destroy();

                self.CreateDropzone("create", "#modal-content-listing form");
            }
        });
    };

    self.CreateMarker = function(listing)
    {
        var marker = L.marker([listing.XCoordinate, entry[0].WorldCoordinates.y]).addTo(map);
        marker.setIcon(L.mapbox.marker.icon({
            'marker-color': (entry[0].IsFeatured ? '#4078c0' : '#000'),
            'marker-size': (entry[0].IsFeatured ? 'large' : 'medium'),
            'marker-symbol': 'building'
        }));

        var slideshowContent = "";
        var base = (entry[0].Testing ? "" : "/images/enhabit/images/");
        var images = entry[0].Thumbnails;
        if (!images || images.length === 0) {
            images = [];
            images.push(defaultPicture);
        }
        for (var i = 0; i < images.length; i++) {
            var source = base + images[i];

            slideshowContent +=
                                '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                                  '<img src="' + source + '" height="200" width="300"/>' +
                                '</div>';
        }

        var popupContent =
                    '<a onclick="CloseLeafletPopup()" class="enhabit-popup-close-button">x</a>' +
                    '<div id="' + entry[0]._id.$oid + '" class="popup">' +
                        '<div style="position: absolute; top: 5%; left: 5%; z-index: 1; width: 83%;">' +
                            '<h2>' + entry[0].Address + ' ' + (entry[0].Unit ? "<br>Unit " + entry[0].Unit : "") + '</h2>' +
                            '<h3>$' + entry[0].Price + '</h3>' +
                        '</div>' +
                        '<div class="slideshow">';

        if (images.length > 1) {
            popupContent += '<div class="slider-arrow slider-left"><img src="assets/images/theme_images/carousel_arrow_left.png" class="slider-arrow-left" /></div>' +
                            '<div class="slider-arrow slider-right"><img src="assets/images/theme_images/carousel_arrow_right.png" class="slider-arrow-right" /></div>';
        }

        entry[0].Thumbnails = ToStringFromList(entry[0].Thumbnails);

        popupContent += slideshowContent +
                        '</div>' +
                    '</div>' +
                    "<input type='button' class='btn btn-outline-inverse btn-sm popup-details-btn' value='More Details' onclick=\"OpenListing('" + entry[0]._id.$oid + "', '" + entry[0].Address + "', '" + entry[0].Unit + "', '" + entry[0].Start + "', '" + entry[0].Bedrooms + "', '" + entry[0].Bathrooms + "', '" + entry[0].Price + "', '" + entry[0].LeaseType + "', '" + entry[0].BuildingType + "', '" + entry[0].Notes + "', '" + entry[0].HasAnimals + "', '" + entry[0].HasLaundry + "', '" + entry[0].HasParking + "', '" + entry[0].HasAirConditioning + "', [" + entry[0].Thumbnails + "], '" + entry[0].WorldCoordinates.x + "', '" + entry[0].WorldCoordinates.y + "', '" + entry[0].Testing + "', '" + entry[0].Username + "', '" + entry[0].Landlord + "')\" />";

        popupContent += '<div class="popup-background-shadow"></div>';

        marker.bindPopup(popupContent,
        {
            closeButton: true,
            minWidth: 320
        });

        markers.addLayer(marker);
    };

    self.CreateListing = function (userGuid)
    {
        self.CreateListingUserGuid(userGuid);
        try
        {
            // async call, caught in dropzone.success event handler
            if (self.NumAdded() == 0)
            {
                self.ProcessListing();
            }
            else
            {
                self.Dropzones["create"].processQueue();
            }
        }
        catch (e)
        {
            $.msgGrowl({ type: 'error', title: 'Error', text: e.message, position: 'top-center' });
        }
    };

    self.LogoutUser = function ()
    {
        
    };

    self.ShowLoginNav = function (hideLoginModal) {
        self.UserLoggedIn(true);

        self.NavLinks(ko.utils.arrayMap(enhabitMapData.NavLinks, function (navLink) {
            return new NavLinkViewModel(navLink);
        }));

        if (hideLoginModal) {
            $("#common-modal").modal('hide');
        }
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