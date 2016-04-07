using System.Linq;

namespace Enhabit.Presenter.Extensions
{
    public static class ImageExtensions
    {
        public static string ToThumbnail(this string image)
        {
            var insertedThumnailParam = image.Split('/').ToList();
            insertedThumnailParam.Insert(6, "c_scale,w_300");

            return string.Join("/", insertedThumnailParam);
        }
    }
}
