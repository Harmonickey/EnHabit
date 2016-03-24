var UserViewModel = function (user, parentViewModel)
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

    self.InitUser = function (user) {
        self.Username(user ? user.Username : undefined);
        self.Email(user ? user.Email : undefined);
        self.PhoneNumber(user ? user.PhoneNumber : undefined);
        self.FirstName(user ? user.FirstName : undefined);
        self.LastName(user ? user.LastName : undefined);
    };

    self.LoginEnabled = ko.observable(true);
    self.LoginError = ko.observable();
    self.LoginErrorVisible = ko.observable(false);

    self.CreateAccountEnabled = ko.observable(true);
    self.CreateAccountError = ko.observable();
    self.CreateAccountErrorVisible = ko.observable(false);

    self.UpdateAccountEnabled = ko.observable(true);
    self.UpdateAccountText = ko.observable("Update Account");

    self.DeleteAccountEnabled = ko.observable(true);
    self.DeleteAccountText = ko.observable("Delete Account");

    self.OpenRegisterModal = function () {
        CleanModalViewModel();
        parentViewModel.OpenRegisterModal();
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

                        parentViewModel.NavLinkData(res.NavLinks);
                        parentViewModel.ShowLoginNav(true);
                        parentViewModel.UserLoggedIn(true);
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
                        parentViewModel.ShowLoginNav(true);
                        parentViewModel.UserLoggedIn(true);
                        parentViewModel.NavLinkData(res.NavLinks);

                        $.msgGrowl({ type: 'success', title: 'Success', text: "User Created Successfully!", position: 'top-center' });
                        $.msgGrowl({ type: 'success', title: 'Success', text: "User Logged In Successfully!", position: 'top-center' });

                        // session should be set, so the user will be attached to the listing
                        if (parentViewModel.PendingListingData() != undefined)
                        {
                            parentViewModel.CreateListing(res);
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
        var data = ko.toJSON({
            Username: self.Username(),
            FirstName: self.FirstName(),
            LastName: self.LastName(),
            Email: self.Email(),
            PhoneNumber: self.PhoneNumber()
        });

        $.ajax(
        {
            type: "POST",
            url: "/User/Update",
            data: data,
            dataType: "json",
            contentType: "application/json charset=utf-8",
            beforeSend: function () {
                self.UpdateAccountEnabled(false);
                self.UpdateAccountText("Updating...");
            },
            success: function (res) {
                try
                {
                    if (res != false)
                    {
                        self.InitUser(res);

                        $.msgGrowl({ type: 'success', title: 'Success', text: "Successfully Updated Account", position: 'top-center' });
                    }
                    else
                    {
                        throw new Error("Problem Updating Account");
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
                self.UpdateAccountEnabled(true);
                self.UpdateAccountText("Update Account");
            }
        });
    };

    self.DeleteAccount = function ()
    {
        //check if the user really wants to do so
        $.msgbox("<p>Are you sure you want to delete your account?<br>Please Enter your Password to Confirm.</p>",
        {
            type: "prompt",
            inputs: [
              { type: "password", label: "Password:", required: true }
            ],
            buttons: [
              { type: "submit", value: "OK" },
              { type: "cancel", value: "Cancel" }
            ]
        }, function (password)
        {
            if (password != false)
            {
                var data = ko.toJSON({
                    Password: password
                });

                $.ajax(
                {
                    type: "POST",
                    url: "/User/Delete",
                    data: data,
                    dataType: "json",
                    contentType: "application/json charset=utf-8",
                    beforeSend: function ()
                    {
                        self.DeleteAccountEnabled(false);
                        self.DeleteAccountText("Deleting...");
                    },
                    success: function (res)
                    {
                        try
                        {
                            if (res == true)
                            {
                                window.location = $("#logout-btn").attr("href");
                            }
                            else
                            {
                                throw new Error(res);
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
                        self.DeleteAccountEnabled(true);
                        self.DeleteAccountText("Delete Account");
                    }
                });
            }
        });
    };

    self.InitUser(user);
};