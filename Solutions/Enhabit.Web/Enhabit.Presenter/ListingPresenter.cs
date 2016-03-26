using Enhabit.Repository.Contracts;
using Enhabit.Models;
using Enhabit.Presenter.Commands;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.ViewModels;

namespace Enhabit.Presenter
{
    public sealed class ListingPresenter
    {
        private readonly IListingRepository _listingRepo;
        private readonly IImageRepository _imageRepo;
        private readonly ICloudinaryAdaptor _cloudinaryAdaptor;

        public ListingPresenter(IListingRepository listingRepo, IImageRepository imageRepo, ICloudinaryAdaptor cloudinaryAdaptor)
        {
            _listingRepo = listingRepo;
            _imageRepo = imageRepo;
            _cloudinaryAdaptor = cloudinaryAdaptor;
        }

        public ListingViewModel CreateListing(Listing listing)
        {
            return Listings.Create(_listingRepo, _imageRepo, listing);
        }

        public ListingViewModel UpdateListing(Listing listing)
        {
            return Listings.Update(_listingRepo, _imageRepo, _cloudinaryAdaptor, listing);
        }
    }
}
