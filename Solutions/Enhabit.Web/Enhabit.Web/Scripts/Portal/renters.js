var RenterViewModel = function (renter)
{
    var self = this;

    self.FirstName = renter.FirstName;
    self.LastName = renter.LastName;
    self.FullName = ko.pureComputed(function () {
        return self.FirstName + " " + self.LastName;
    });

    self.Address = renter.Address;
    self.Unit = renter.Unit;
    self.FormattedAddress = ko.pureComputed(function () {
        return self.Address + " " + (self.Unit ? self.Unit : "");
    });

    self.Rent = renter.Rent;
    self.FormattedRent = ko.pureComputed(function () {
        return accouting.formatMoney(Rent);
    });
    self.HasPaidRent = renter.HasPaidRent;

    self.Email = renter.Email;
    self.PhoneNumber = renter.PhoneNumber;
};