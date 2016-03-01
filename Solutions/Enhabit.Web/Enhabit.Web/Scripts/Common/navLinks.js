var NavLinkViewModel = function (navLink)
{
    var self = this;

    self.Selected = ko.observable(false);

    self.LinkHref = navLink.Href;
    self.LinkName = navLink.Name;
    self.LinkClass = navLink.Class;
};