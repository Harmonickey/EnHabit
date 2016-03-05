using Enhabit.Repository.Contracts;
using System;
using System.Collections.Generic;

using Enhabit.Presenter.DataAdaptors;
using Enhabit.Models;
using System.Data.SqlClient;
using System.Data;

namespace Enhabit.Repository.ADO
{
    public class EnhabitMapRepository : IEnhabitMapRepository
    {
        private readonly string _enhabitConnString;

        private readonly IImageRepository _imageRepository;

        public SqlConnection SqlConn { get; set; }

        public EnhabitMapRepository(IConfigAdaptor configAdaptor, IImageRepository imageRepository)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
            _imageRepository = imageRepository;
        }

        public bool CreateListing(Listing listing)
        {
            IEnumerable<string> image = _imageRepository.SaveImages(listing.Images);

            // save listing to the database

            return true;
        }

        public IEnumerable<Listing> GetListings()
        {
            var listings = new List<Listing>();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetListings]";
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        listings.Add(new Listing
                        {
                            Price = (int)reader["Price"],
                            Address = reader["Address"].ToString(),
                            AvailableStartDate = (DateTime)reader["StartDate"],
                            IsFeatured = (bool)reader["IsFeatured"],
                            IsActive = (bool)reader["IsActive"],
                            OwnerName = reader["OwnerName"].ToString(),
                            LandlordName = reader["LandlordName"].ToString()
                        });
                    }
                }

                return listings;
            }
        }

        public IEnumerable<Listing> SearchForListings(SearchQuery query)
        {
            var listings = new List<Listing>();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetListings]";
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        listings.Add(new Listing
                        {
                            Price = (int)reader["Price"],
                            Address = reader["Address"].ToString(),
                            AvailableStartDate = (DateTime)reader["StartDate"],
                            IsFeatured = (bool)reader["IsFeatured"],
                            IsActive = (bool)reader["IsActive"],
                            OwnerName = reader["OwnerName"].ToString(),
                            LandlordName = reader["LandlordName"].ToString()
                        });
                    }
                }

                return listings;
            }
        }
    }
}
