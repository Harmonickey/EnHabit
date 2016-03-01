using System.Collections.Generic;
using System.Linq;
using Enhabit.ViewModels;
using Enhabit.Repository.Contracts;
using Enhabit.Presenter.Extensions;

namespace Enhabit.Presenter.Commands
{
    public static class Universities
    {
        public static IEnumerable<UniversityViewModel> GetAll(IUniversityRepository repo)
        {
            var universities = repo.GetAllUniversities();
            
            return universities.Select(l => l.ToUniversityViewModel());
        }
    }
}
