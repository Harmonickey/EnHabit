CREATE PROCEDURE [Enhabit].[GetUsers]
	@AccountTypeId INT
AS
BEGIN

SET NOCOUNT ON;

	SELECT
		[Username],
		[FirstName],
		[LastName],
		[PhoneNumber],
		[Email],
		[UserId]
	FROM Enhabit.Users
	WHERE AccountTypeId = @AccountTypeId

END
