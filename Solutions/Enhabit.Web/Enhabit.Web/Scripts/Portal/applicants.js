var ApplicantViewModel = function (applicant)
{
    var self = this;

    self.FirstName = applicant.FirstName;
    self.LastName = applicant.LastName;
    self.FullName = ko.pureComputed(function () {
        return self.FirstName + " " + self.LastName;
    });

    self.Address = applicant.Address;
    self.Unit = applicant.Unit;
    self.FormattedAddress = ko.pureComputed(function () {
        return self.Address + " " + (self.Unit ? self.Unit : "");
    });

    self.Email = applicant.Email;

    self.RemoveApplicant = function () {

    };

    self.AcceptApplicant = function () {

    };
};