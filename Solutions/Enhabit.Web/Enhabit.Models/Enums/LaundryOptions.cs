using System.ComponentModel;

namespace Enhabit.Models.Enums
{
    public enum LaundryOptions
    {
        [Description("None")]
        None = 0, 

        [Description("InUnit")]
        InUnit,

        [Description("InBuilding")]
        InBuilding
    }
}
