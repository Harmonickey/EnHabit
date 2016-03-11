using Enhabit.Models;

namespace Enhabit.Repository.Contracts
{
    public interface IPricingRepository
    {
        PriceRange GetPriceRange();
    }
}
