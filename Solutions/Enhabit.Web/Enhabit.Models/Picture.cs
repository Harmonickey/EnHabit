using System;

namespace Enhabit.Models
{
    public class Picture
    {
        public Guid PicturesId { get; set; }
        public string PictureName { get; set; }
        public string CloudinaryUrl { get; set; }
    }
}
