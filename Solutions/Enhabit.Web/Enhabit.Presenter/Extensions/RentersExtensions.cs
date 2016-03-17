using Enhabit.ViewModels;
using Enhabit.Models;

namespace Enhabit.Presenter.Extensions
{
    public static class RentersExtensions
    {
        public static RenterViewModel ToRenterViewModel(this Renter renter)
        {
            return new RenterViewModel();
        }
    }
}
