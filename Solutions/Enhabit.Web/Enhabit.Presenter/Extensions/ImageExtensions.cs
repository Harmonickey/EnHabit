using System.Linq;

namespace Enhabit.Presenter.Extensions
{
    public static class ImageExtensions
    {
        public static string ToThumbnail(this string image)
        {
            var insertedThumnailParam = image.Split('/').ToList();
            insertedThumnailParam.Insert(5, "c_thumb,w_100");

            return string.Join("/", insertedThumnailParam);
        }
    }
}
