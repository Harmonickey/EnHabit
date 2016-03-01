using Enhabit.ViewModels;
using Enhabit.Models;

namespace Enhabit.Presenter.Extensions
{
    public static class ApplicantsExtensions
    {
        public static ApplicantViewModel ToApplicantViewModel(this Applicant applicant)
        {
            return new ApplicantViewModel();
        }
    }
}
