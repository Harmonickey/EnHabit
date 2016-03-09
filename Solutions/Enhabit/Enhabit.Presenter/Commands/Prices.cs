using Enhabit.Repository.Contracts;
using Enhabit.ViewModels;
using Enhabit.Presenter.Extensions;

namespace Enhabit.Presenter.Commands
{
    public static class Prices
    {
        public static PriceRangeViewModel GetRange(IPricingRepository repo)
        {
            var priceRange = repo.GetPriceRange();

            return priceRange.ToPriceRangeViewModel();
        }
    }
}
