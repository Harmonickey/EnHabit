using System;
using System.Collections.Generic;
using System.Data;

namespace Enhabit.Presenter.Extensions
{
    /// <summary>
    /// Extension method for use with Enhabit.Models enumerations.
    /// </summary>
    public static class DataTableExtensions
    {
        /// <summary>
        /// Converts to System.DataTable for querying pictures
        /// </summary>
        /// <param name="pictureIds"></param>
        /// <returns></returns>
        public static DataTable ToDataTablePictureIds(this IEnumerable<Guid> pictureIds)
        {
            DataTable dtLocation = new DataTable("TT_PictureIds");
            dtLocation.Columns.Add(new DataColumn { ColumnName = "PictureId", DataType = typeof(Guid) });
            
            foreach (var item in pictureIds)
            {
                DataRow row = dtLocation.NewRow();
                row[0] = item;

                dtLocation.Rows.Add(row);
            }

            return dtLocation;
        }

        /// <summary>
        /// Converts to System.DataTable for deleting pictures
        /// </summary>
        /// <param name="pictureCloudinaryPublicIds"></param>
        /// <returns></returns>
        public static DataTable ToDataTablePictureCloudinaryPublicIds(this IEnumerable<string> pictureCloudinaryPublicIds)
        {
            DataTable dtLocation = new DataTable("TT_PictureCloudinaryPublicIds");
            dtLocation.Columns.Add(new DataColumn { ColumnName = "CloudinaryPublicId", DataType = typeof(string) });

            foreach (var item in pictureCloudinaryPublicIds)
            {
                DataRow row = dtLocation.NewRow();
                row[0] = item;

                dtLocation.Rows.Add(row);
            }

            return dtLocation;
        }
    }
}
