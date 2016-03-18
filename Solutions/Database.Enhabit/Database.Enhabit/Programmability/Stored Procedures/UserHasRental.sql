CREATE PROCEDURE [Enhabit].[UserHasRental]
	@UserId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT
		UserId
	FROM Enhabit.Renters
	WHERE RenterId = @UserId

END
