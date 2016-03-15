using Enhabit.Repository.Contracts;
using Enhabit.Models;
using Enhabit.Presenter.Commands;

namespace Enhabit.Presenter
{
    public sealed class ListingPresenter
    {
        private readonly IListingRepository _listingRepo;

        public ListingPresenter(IListingRepository listingRepo)
        {
            _listingRepo = listingRepo;
        }

        public bool CreateListing(Listing listing)
        {
            return Listings.Create(_listingRepo, listing);
        }
    }
}
