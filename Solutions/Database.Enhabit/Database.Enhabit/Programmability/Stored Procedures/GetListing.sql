CREATE PROCEDURE [Enhabit].[GetListing]
	@ListingsId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT 
		[ListingId],
		[UserId],
		[PicturesId],
		[UniversityId],
		[Address],
		[Unit],
		[XCoordinate],
		[YCoordinate],
		[Price],
		[Bedrooms],
		[Bathrooms],
		[PetId],
		[LaundryId],
		[ParkingId],
		[HasAirConditioning],
		[LeaseTypeId],
		[BuildingTypeId],
		[StartDate],
		[IsRented],
		[IsFeatured],
		[IsPastThreshold],
		[IsActive],
		[Notes]
	FROM Enhabit.Listings
	WHERE ListingId = @ListingsId

END
