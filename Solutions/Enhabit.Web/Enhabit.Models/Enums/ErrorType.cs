using System.ComponentModel;

namespace Enhabit.Models.Enums
{
    public enum ErrorType
    {
        [Description("Username Already Exists")]
        UsernameAlreadyExists = 1,

        [Description("Phone Number Already Exists")]
        PhoneNumberAlreadyExists,

        [Description("Email Already Exists")]
        EmailAlreadyExists,
        
        [Description("Invalid Username Or Password")]
        InvalidUsernameOrPassword,

        [Description("Unknown Error")]
        Unknown
    }
}
