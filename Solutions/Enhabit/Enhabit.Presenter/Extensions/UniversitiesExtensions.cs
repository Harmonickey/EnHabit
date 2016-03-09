using Enhabit.Models;
using Enhabit.ViewModels;

namespace Enhabit.Presenter.Extensions
{
    public static class UniversitiesExtensions
    {
        public static UniversityViewModel ToUniversityViewModel(this University university)
        {
            return new UniversityViewModel
            {
                Name = university.Name,
                Threshold = university.Threshold
            };
        }
    }
}
