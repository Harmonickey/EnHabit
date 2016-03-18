CREATE PROCEDURE [Enhabit].[GetUser]
	@UserId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT
		Username,
		FirstName,
		LastName,
		Email,
		PhoneNumber,
		AccountTypeId
	FROM Enhabit.Users
	WHERE UserId = @UserId

END
