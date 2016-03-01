CREATE PROCEDURE [Enhabit].[GetUserRenters]
	@UserId uniqueidentifier
AS
BEGIN

	SELECT
		r.UserId,
		r.RenterId,
		r.ListingId,
		r.HasPaid,
		r.RentDueDate
	FROM Enhabit.Listings l
	INNER JOIN Enhabit.Renters r ON r.ListingId = l.ListingId -- match all renters
	WHERE l.UserId = @UserId -- get all the listings associated with our user

END
