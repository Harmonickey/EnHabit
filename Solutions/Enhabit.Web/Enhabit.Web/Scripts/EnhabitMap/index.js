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

    self.User = new UserViewModel(enhabitMapData.User, self);

    self.ExtraFiltersBtnText = ko.observable("Open Extra Filters");

    self.IsExtrasViewOpen = ko.observable(false);

    self.NavLinkData = ko.observableArray(enhabitMapData.NavLinks);

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
        InitSpecialFields("#common-modal");
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
        var marker = L.marker([listing.XCoordinate, listing.YCoordinate]).addTo(self.Map);
        
        marker.setIcon(L.mapbox.marker.icon({
            'marker-color': (listing.IsFeatured ? '#4078c0' : '#000'),
            'marker-size': (listing.IsFeatured ? 'large' : 'medium'),
            'marker-symbol': 'building'
        }));

        var slideshowContent = "";

        var thumbnails = listing.ThumbnailUrls;
        if (!thumbnails || thumbnails.length === 0)
        {
            thumbnails = [];
            thumbnails.push(self.DefaultPicture);
        }
        for (var i = 0; i < thumbnails.length; i++)
        {
            var source = thumbnails[i];

            slideshowContent +=
                                '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                                  '<img src="' + source + '" height="200" width="300"/>' +
                                '</div>';
        }

        var popupContent =
                    '<a onclick="CloseLeafletPopup()" class="enhabit-popup-close-button">x</a>' +
                    '<div class="popup">' +
                        '<div style="position: absolute; top: 5%; left: 5%; z-index: 1; width: 83%;">' +
                            '<h2>' + listing.Address + ' ' + (listing.Unit ? "<br>Unit " + listing.Unit : "") + '</h2>' +
                            '<h3>$' + listing.Price + '</h3>' +
                        '</div>' +
                        '<div class="slideshow">';

        if (thumbnails.length > 1) {
            popupContent += '<div class="slider-arrow slider-left"><img src="/Images/carousel_arrow_left.png" class="slider-arrow-left" /></div>' +
                            '<div class="slider-arrow slider-right"><img src="/Images/carousel_arrow_right.png" class="slider-arrow-right" /></div>';
        }

        var ThumbnailsList = $.map(listing.ThumbnailUrls, function (d) {
            return "'" + d + "'";
        }).join(",");

        popupContent += slideshowContent +
                        '</div>' +
                    '</div>' +
                    "<input type='button' class='btn btn-outline-inverse btn-sm popup-details-btn' value='More Details' onclick=\"OpenListing('" + listing.Address + "', '" + listing.Unit + "', '" + listing.Start + "', '" + listing.Bedrooms + "', '" + listing.Bathrooms + "', '" + listing.Price + "', '" + listing.LeaseType + "', '" + listing.BuildingType + "', '" + listing.Notes + "', '" + listing.Animals + "', '" + listing.Laundry + "', '" + listing.Parking + "', '" + listing.HasAirConditioning + "', [" + ThumbnailsList + "], '" + listing.Testing + "', '" + listing.Username + "', '" + listing.Landlord + "')\" />";

        popupContent += '<div class="popup-background-shadow"></div>';

        marker.bindPopup(popupContent,
        {
            closeButton: true,
            minWidth: 320
        });
        
        self.Markers.addLayer(marker);
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
            error: function() 
            {
                $.msgGrowl({ type: 'error', title: 'Error', text: "Problem Logging Out", position: 'top-center' });
            }
        });
    };

    self.ShowLoginNav = function (hideLoginModal, navLinks)
    {
        if (hideLoginModal)
        {
            $("#common-modal").modal('hide');
        }
    };

    self.NavLinks = ko.computed(function() { 
        return ko.utils.arrayMap(self.NavLinkData(), function (navLink) {
            return new NavLinkViewModel(navLink);
        });
    });

    self.Listings = ko.observableArray(enhabitMapData.Listings);

    self.SearchForListings = function ()
    {

    };

    $.each(self.Listings(), function (index, listing) {
        self.CreateMarker(listing);
    });
};