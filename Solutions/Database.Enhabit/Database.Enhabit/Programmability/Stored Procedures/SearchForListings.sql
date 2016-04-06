CREATE PROCEDURE [Enhabit].[SearchForListings]
	@priceLow decimal,
    @priceUpper decimal,
	@bedrooms int,
    @bathrooms int,
    @laundry int,
    @parking int,
    @animals int,
    @airConditioning bit,
    @leaseType int,
    @buildingType int,
    @startDate datetime
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
		[IsPastThreshold]
	FROM Enhabit.Listings
	WHERE Price BETWEEN @priceLow AND @priceUpper
	AND   Bedrooms >= @bedrooms
	AND   Bathrooms >= @bathrooms
	AND   LaundryId = @laundry
	AND   ParkingId = @parking
	AND   PetId = @animals
	AND   HasAirConditioning = @airConditioning
	AND   LeaseTypeId = @leaseType
	AND   BuildingTypeId = @buildingType
	AND   StartDate >= @startDate
	AND   IsActive = 1
END
