﻿using System;
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
        /// <param name="pictures"></param>
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
    }
}
