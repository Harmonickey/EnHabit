var UserViewModel = function (user, enhabitMapViewModel)
{
    var self = this;

    self.Username = ko.observable();
    self.Password = ko.observable();
    self.NewPassword = ko.observable();
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

    self.LoginUser = function ()
    {
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

                        enhabitMapViewModel.NavLinkData(res.NavLinks);
                        enhabitMapViewModel.ShowLoginNav(true);
                        enhabitMapViewModel.UserLoggedIn(true);
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

    self.CreateAccount = function ()
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
                        enhabitMapViewModel.UserLoggedIn(true);

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

    self.UpdateAccount = function ()
    {

    };

    self.DeleteAccount = function () {

    };
};