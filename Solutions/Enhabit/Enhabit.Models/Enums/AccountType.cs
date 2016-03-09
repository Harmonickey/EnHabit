using System.ComponentModel;

namespace Enhabit.Models.Enums
{
    public enum AccountType
    {
        [Description("Admin")]
        Apartment = 0,

        [Description("Landlord")]
        House,

        [Description("Tenant")]
        Tenant
    }
}
