CREATE PROCEDURE [Enhabit].[GetUserListings]
	@UserId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT 
		li.Price,
		li.[Address],
		li.StartDate,
		li.IsFeatured,
		te.Username AS OwnerName,
		la.Username AS LandlordName
	FROM Enhabit.Listings li
	INNER JOIN Enhabit.Users te ON li.UserId = te.UserId
	INNER JOIN Enhabit.Users la ON li.LandlordId = la.UserId
	WHERE li.UserId = @UserId

END
