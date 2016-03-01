CREATE PROCEDURE [Enhabit].[CreateListing]
	@ListingId uniqueidentifier,
	@UserId uniqueidentifier,
	@PicturesId uniqueidentifier,
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
	@IsRented BIT,
	@IsFeatured BIT
AS
BEGIN

SET NOCOUNT ON;

INSERT INTO Enhabit.Listings(ListingId, 
UserId, PicturesId, UniversityId, [Address], Unit, 
XCoordinate, YCoordinate, Price, Bedrooms, Bathrooms, 
PetId, LaundryId, ParkingId, HasAirConditioning, 
LeaseTypeId, BuildingTypeId, StartDate, IsRented, IsFeatured)
VALUES(@ListingId, @UserId, @PicturesId, @UniversityId, @Address,
@Unit, @XCoordinate, @YCoordinate, @Price, @Bedrooms, @Bathrooms,
@PetId, @LaundryId, @ParkingId, @HasAirConditioning, @LeaseTypeId,
@BuildingTypeId, @StartDate, @IsRented, @IsFeatured);

END
