CREATE PROCEDURE [Enhabit].[CreateListing]
	@ListingId uniqueidentifier,
	@UserId uniqueidentifier,
	@PicturesId uniqueidentifier,
	@UniversityId uniqueidentifier,
	@LandlordId uniqueidentifier,
	@Address VARCHAR(250),
	@Unit VARCHAR(10),
	@Notes VARCHAR(1000),
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
	@IsRented BIT,
	@IsFeatured BIT,
	@IsPastThreshold BIT,
	@IsActive BIT
AS
BEGIN

SET NOCOUNT ON;

INSERT INTO Enhabit.Listings(
ListingId, UserId, PicturesId, UniversityId, LandlordId, [Address], Unit, 
Notes, XCoordinate, YCoordinate, Price, Bedrooms, Bathrooms, 
PetId, LaundryId, ParkingId, HasAirConditioning, 
LeaseTypeId, BuildingTypeId, StartDate, IsRented, IsFeatured, IsPastThreshold, IsActive)
VALUES(
@ListingId, @UserId, @PicturesId, @UniversityId,  @LandlordId, @Address, @Unit,
@Notes, @XCoordinate, @YCoordinate, @Price, @Bedrooms, @Bathrooms,
@PetId, @LaundryId, @ParkingId, @HasAirConditioning, 
@LeaseTypeId, @BuildingTypeId, @StartDate, @IsRented, @IsFeatured, @IsPastThreshold, @IsActive);

END
