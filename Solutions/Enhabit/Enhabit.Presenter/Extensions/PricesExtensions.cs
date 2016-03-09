using Enhabit.ViewModels;
using Enhabit.Models;

namespace Enhabit.Presenter.Extensions
{
    public static class PricesExtensions
    {
        public static PriceRangeViewModel ToPriceRangeViewModel(this PriceRange range)
        {
            return new PriceRangeViewModel
            {
                Low = range.Low,
                High = range.High
            };
        }
    }
}
