using Enhabit.Repository.Contracts;
using Enhabit.Models;
using Enhabit.Presenter.Commands;
using Enhabit.ViewModels;

namespace Enhabit.Presenter
{
    public sealed class ListingPresenter
    {
        private readonly IListingRepository _listingRepo;
        private readonly IImageRepository _imageRepo;

        public ListingPresenter(IListingRepository listingRepo, IImageRepository imageRepo)
        {
            _listingRepo = listingRepo;
            _imageRepo = imageRepo;
        }

        public ListingViewModel CreateListing(Listing listing)
        {
            return Listings.Create(_listingRepo, _imageRepo, listing);
        }
    }
}
