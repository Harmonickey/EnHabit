using System.ComponentModel;

namespace Enhabit.Models.Enums
{
    public enum AccountType
    {
        [Description("Admin")]
        Admin = 0,

        [Description("Landlord")]
        Landlord,

        [Description("Tenant")]
        Tenant
    }
}
