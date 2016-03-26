using Enhabit.Repository.Contracts;
using System;
using System.Collections.Generic;

using System.Transactions;
using IsolationLevel = System.Transactions.IsolationLevel;
using Enhabit.Presenter.DataAdaptors;
using Enhabit.Models;
using System.Data.SqlClient;
using System.Data;
using log4net;
using System.Linq;

namespace Enhabit.Repository.ADO
{
    public class ListingRepository : IListingRepository
    {
        private readonly string _enhabitConnString;
        private readonly TransactionScopeOption _transactionScopeOption;
        private readonly TransactionOptions _transactionOptions;

        private readonly IImageRepository _imageRepo;
        private readonly ILog _logger;

        public ListingRepository(IConfigAdaptor configAdaptor, IImageRepository imageRepo, ILog logger)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
            _transactionScopeOption = TransactionScopeOption.Required;
            _transactionOptions = new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted };
            _imageRepo = imageRepo;
            _logger = logger;
        }

        public bool CreateListing(Listing listing)
        {
            using (var transactionScope = new TransactionScope(_transactionScopeOption, _transactionOptions))
            {
                try
                {
                    using (var SqlConn = new SqlConnection(_enhabitConnString))
                    {
                        SqlConn.Open();
                        using (var cmd = SqlConn.CreateCommand())
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandText = "[Enhabit].[CreateListing]";
                            cmd.Parameters.AddWithValue("@ListingId", listing.ListingId);
                            cmd.Parameters.AddWithValue("@UserId", listing.UserId);
                            cmd.Parameters.AddWithValue("@PicturesId", listing.PicturesId);
                            cmd.Parameters.AddWithValue("@UniversityId", listing.UniversityId);
                            cmd.Parameters.AddWithValue("@Address", listing.Address);
                            cmd.Parameters.AddWithValue("@Unit", listing.Unit);
                            cmd.Parameters.AddWithValue("@XCoordinate", listing.XCoordinate);
                            cmd.Parameters.AddWithValue("@YCoordinate", listing.YCoordinate);
                            cmd.Parameters.AddWithValue("@Price", listing.Price);
                            cmd.Parameters.AddWithValue("@Bedrooms", listing.Bedrooms);
                            cmd.Parameters.AddWithValue("@Bathrooms", listing.Bathrooms);
                            cmd.Parameters.AddWithValue("@PetId", listing.Animals);
                            cmd.Parameters.AddWithValue("@LaundryId", listing.Laundry);
                            cmd.Parameters.AddWithValue("@ParkingId", listing.Parking);
                            cmd.Parameters.AddWithValue("@HasAirConditioning", listing.HasAirConditioning);
                            cmd.Parameters.AddWithValue("@LeaseTypeId", listing.LeaseType);
                            cmd.Parameters.AddWithValue("@BuildingTypeId", listing.BuildingType);
                            cmd.Parameters.AddWithValue("@StartDate", listing.AvailableStartDate);
                            cmd.Parameters.AddWithValue("@IsRented", listing.IsRented);
                            cmd.Parameters.AddWithValue("@IsFeatured", listing.IsFeatured);
                            
                            cmd.ExecuteNonQuery();
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("ListingRepository.CreateListing({0}) Exception: {1}", listing.Address, ex.Message));
                    return false;
                }
            }

            return true;
        }

        public bool UpdateListing(Listing listing)
        {
            using (var transactionScope = new TransactionScope(_transactionScopeOption, _transactionOptions))
            {
                try
                {
                    using (var SqlConn = new SqlConnection(_enhabitConnString))
                    {
                        SqlConn.Open();
                        using (var cmd = SqlConn.CreateCommand())
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandText = "[Enhabit].[UpdateListing]";
                            cmd.Parameters.AddWithValue("@ListingId", listing.ListingId);
                            cmd.Parameters.AddWithValue("@UserId", listing.UserId);
                            cmd.Parameters.AddWithValue("@PicturesId", listing.PicturesId);
                            cmd.Parameters.AddWithValue("@UniversityId", listing.UniversityId);
                            cmd.Parameters.AddWithValue("@Address", listing.Address);
                            cmd.Parameters.AddWithValue("@Unit", listing.Unit);
                            cmd.Parameters.AddWithValue("@XCoordinate", listing.XCoordinate);
                            cmd.Parameters.AddWithValue("@YCoordinate", listing.YCoordinate);
                            cmd.Parameters.AddWithValue("@Price", listing.Price);
                            cmd.Parameters.AddWithValue("@Bedrooms", listing.Bedrooms);
                            cmd.Parameters.AddWithValue("@Bathrooms", listing.Bathrooms);
                            cmd.Parameters.AddWithValue("@PetId", listing.Animals);
                            cmd.Parameters.AddWithValue("@LaundryId", listing.Laundry);
                            cmd.Parameters.AddWithValue("@ParkingId", listing.Parking);
                            cmd.Parameters.AddWithValue("@HasAirConditioning", listing.HasAirConditioning);
                            cmd.Parameters.AddWithValue("@LeaseTypeId", listing.LeaseType);
                            cmd.Parameters.AddWithValue("@BuildingTypeId", listing.BuildingType);
                            cmd.Parameters.AddWithValue("@StartDate", listing.AvailableStartDate);
                            cmd.Parameters.AddWithValue("@IsRented", listing.IsRented);
                            cmd.Parameters.AddWithValue("@IsFeatured", listing.IsFeatured);

                            cmd.ExecuteNonQuery();
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("ListingRepository.CreateListing({0}) Exception: {1}", listing.Address, ex.Message));
                    return false;
                }
            }

            return true;
        }

        public IEnumerable<Listing> GetAllListings()
        {
            var listings = new List<Listing>();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetAllListings]";
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
                            PicturesId = (Guid)reader["PictureId"]
                        });
                    }

                    var pictures = _imageRepo.GetListingsPictures(listings.Select(l => l.PicturesId));

                    foreach (Listing listing in listings)
                    {
                        var matchingPictures = pictures.Where(p => p.PicturesId == listing.PicturesId);

                        if (matchingPictures.Any())
                        {
                            listing.ImageUrls = matchingPictures.Select(p => p.CloudinaryUrl);
                        }
                    }
                } 
            }

            return listings;
        }

        public Listing GetListing(Guid listingId)
        {
            var listing = new Listing();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetListing]";
                    cmd.Parameters.AddWithValue("@ListingsId", listingId);
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        listing.Price = (int)reader["Price"];
                        listing.Address = reader["Address"].ToString();
                        listing.AvailableStartDate = (DateTime)reader["StartDate"];
                        listing.IsFeatured = (bool)reader["IsFeatured"];
                        listing.IsActive = (bool)reader["IsActive"];
                        listing.TenantName = reader["OwnerName"].ToString();
                        listing.LandlordName = reader["LandlordName"].ToString();
                        listing.PicturesId = (Guid)reader["PictureId"];
                    }

                    var pictures = _imageRepo.GetListingsPictures(new List<Guid> { listing.ListingId });

                    if (pictures.Any())
                    {
                        listing.ImageUrls = pictures.Select(p => p.CloudinaryUrl);
                    }
                }
            }

            return listing;
        }

        public IEnumerable<Listing> SearchForListings(SearchQuery query)
        {
            var listings = new List<Listing>();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[SearchForListings]";
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
                }

                return listings;
            }
        }

        public IEnumerable<Listing> GetUserListings(Guid userGuid)
        {
            var listings = new List<Listing>();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetUserListings]";
                    cmd.Parameters.AddWithValue("@UserId", userGuid);
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
                }

                return listings;
            }
        }
    }
}
