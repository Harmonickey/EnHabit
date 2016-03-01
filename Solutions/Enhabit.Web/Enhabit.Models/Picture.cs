using System;

namespace Enhabit.Models
{
    public class Picture
    {
        /// <summary>
        /// Used for database referencing
        /// </summary>
        public Guid PicturesId { get; set; }

        /// <summary>
        /// Used for image loading on views
        /// </summary>
        public string CloudinaryUrl { get; set; }

        /// <summary>
        /// Used for image reference when deleting
        /// </summary>
        public string CloudinaryPublicId { get; set; }
    }
}
