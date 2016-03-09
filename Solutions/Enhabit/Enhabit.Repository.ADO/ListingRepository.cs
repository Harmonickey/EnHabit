using Enhabit.Repository.Contracts;
using System;
using System.Collections.Generic;

using Enhabit.Presenter.DataAdaptors;
using Enhabit.Models;
using System.Data.SqlClient;
using System.Data;

namespace Enhabit.Repository.ADO
{
    public class ListingRepository : IListingRepository
    {
        private readonly string _enhabitConnString;

        private readonly IImageRepository _imageRepo;

        public SqlConnection SqlConn { get; set; }

        public ListingRepository(IConfigAdaptor configAdaptor, IImageRepository imageRepo)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;

            _imageRepo = imageRepo;
        }

        public bool CreateListing(Listing listing)
        {
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

                while (reader.HasRows && reader.Read())
                {
                    listings.Add(new Listing
                    {
                        Price = (int)reader["Price"],
                        Address = reader["Address"].ToString(),
                        AvailableStartDate = (DateTime)reader["StartDate"],
                        IsFeatured = (bool)reader["IsFeatured"],
                        IsActive = (bool)reader["IsActive"],
                        TenantName = reader["OwnerName"].ToString(),
                        LandlordName = reader["LandlordName"].ToString(),
                        ImagesId = (Guid)reader["ImagesId"]
                    });
                }
                
                foreach (Listing listing in listings)
                {
                    _imageRepo.GetAll(listing.ImagesId);
                }    
            }

            return listings;
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
                            TenantName = reader["OwnerName"].ToString(),
                            LandlordName = reader["LandlordName"].ToString()
                        });
                    }
                }

                return listings;
            }
        }
    }
}
