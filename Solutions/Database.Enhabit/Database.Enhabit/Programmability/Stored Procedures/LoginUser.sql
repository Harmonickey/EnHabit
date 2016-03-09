CREATE PROCEDURE [Enhabit].[LoginUser]
	@Username VARCHAR(250),
	@Password VARCHAR(250)
AS
BEGIN

SET NOCOUNT ON;

	SELECT UserId
	FROM Enhabit.Users
	WHERE [Username] = @Username
	AND   [Password] = HASHBYTES('SHA1', @Password)
END
