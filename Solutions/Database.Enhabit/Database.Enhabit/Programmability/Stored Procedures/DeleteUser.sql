CREATE PROCEDURE [Enhabit].[DeleteUser]
	@UserId uniqueidentifier,
	@Password VARCHAR(250)
AS
	
BEGIN

SET NOCOUNT ON;

	DELETE FROM Enhabit.Users
	WHERE UserId = @UserId
	AND   [Password] = HASHBYTES('SHA1', @Password)

END
