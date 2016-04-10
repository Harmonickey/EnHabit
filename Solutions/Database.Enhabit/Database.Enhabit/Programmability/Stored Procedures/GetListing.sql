﻿CREATE PROCEDURE [Enhabit].[GetListing]
	@ListingsId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT 
		li.[ListingId],
		li.[UserId],
		li.[PicturesId],
		li.[UniversityId],
		li.[Address],
		li.[Unit],
		li.[XCoordinate],
		li.[YCoordinate],
		li.[Price],
		li.[Bedrooms],
		li.[Bathrooms],
		li.[PetId],
		li.[LaundryId],
		li.[ParkingId],
		li.[HasAirConditioning],
		li.[LeaseTypeId],
		li.[BuildingTypeId],
		li.[StartDate],
		li.[IsRented],
		li.[IsFeatured],
		li.[IsPastThreshold],
		li.[IsActive],
		li.[Notes],
		te.Username AS OwnerName,
		la.Username AS LandlordName
	FROM Enhabit.Listings li
	INNER JOIN Enhabit.Users te ON li.UserId = te.UserId
	INNER JOIN Enhabit.Users la ON li.LandlordId = la.UserId
	WHERE ListingId = @ListingsId

END
