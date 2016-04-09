CREATE PROCEDURE [Enhabit].[UpdateListing]
	@ListingId uniqueidentifier,
    @UniversityId uniqueidentifier,
    @Address VARCHAR(250),
    @Unit VARCHAR(10),
    @XCoordinate VARCHAR(250),
    @YCoordinate VARCHAR(250),
    @Price DECIMAL(6,2),
    @Bedrooms INT,
    @Bathrooms INT,
    @PetId INT,
    @LaundryId INT,
    @ParkingId INT,
    @HasAirConditioning BIT,
    @LeaseTypeId INT,
    @BuildingTypeId INT,
    @StartDate DATETIME,
	@IsActive BIT,
    @IsRented BIT,
    @IsFeatured BIT
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE Enhabit.Listings
	SET 
		[UniversityId] = @UniversityId, 
		[Address] = @Address, 
		[Unit] = @Unit, 
		[XCoordinate] = @XCoordinate, 
		[YCoordinate] = @YCoordinate, 
		[Price] = @Price, 
		[Bedrooms] = @Bedrooms,
		[Bathrooms] = @Bathrooms, 
		[PetId] = @PetId, 
		[LaundryId] = @LaundryId,
		[ParkingId] = @ParkingId, 
		[HasAirConditioning] = @HasAirConditioning, 
		[LeaseTypeId] = @LeaseTypeId, 
		[BuildingTypeId] = @BuildingTypeId, 
		[StartDate] = @StartDate, 
		[IsActive] = @IsActive,
		[IsRented] = @IsRented, 
		[IsFeatured] = @IsFeatured
	WHERE ListingId = @ListingId
END
