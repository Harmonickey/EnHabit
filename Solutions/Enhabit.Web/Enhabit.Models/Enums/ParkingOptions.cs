using System.ComponentModel;

namespace Enhabit.Models.Enums
{
    public enum ParkingOptions
    {
        [Description("None")]
        None = 0,

        [Description("Garage")]
        Garage,

        [Description("PrivateOutsideLot")]
        PrivateOutsideLot,

        [Description("Street")]
        Street,

    }
}
