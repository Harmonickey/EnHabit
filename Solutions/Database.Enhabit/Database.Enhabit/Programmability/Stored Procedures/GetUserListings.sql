CREATE PROCEDURE [Enhabit].[GetUserListings]
	@UserId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT 
		li.ListingId,
		li.PicturesId,
		li.Price,
		li.[Address],
		li.Unit,
		li.StartDate,
		li.IsFeatured,
		li.IsActive,
		li.IsRented,
		li.PetId,
		li.Bathrooms,
		li.Bedrooms,
		li.LaundryId,
		li.ParkingId,
		li.LeaseTypeId,
		li.BuildingTypeId,
		li.HasAirConditioning,
		li.Notes,
		li.IsPastThreshold,
		li.XCoordinate,
		li.YCoordinate,
		te.Username AS OwnerName,
		la.Username AS LandlordName
	FROM Enhabit.Listings li
	INNER JOIN Enhabit.Users te ON li.UserId = te.UserId
	INNER JOIN Enhabit.Users la ON li.LandlordId = la.UserId
	WHERE li.UserId = @UserId

END
