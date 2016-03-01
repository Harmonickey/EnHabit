using System.ComponentModel;
using System.Reflection;
using Enhabit.Models.Enums;

namespace Enhabit.Presenter.Extensions
{
    public static class ErrorTypeExtensions
    {
        public static string GetDescription(this ErrorType enumValue)
        {
            FieldInfo fi = enumValue.GetType().GetField(enumValue.ToString());
            
            object[] attrs = fi.GetCustomAttributes(typeof(DescriptionAttribute), true);

            return ((DescriptionAttribute)attrs[0]).Description;
        }
    }
}
