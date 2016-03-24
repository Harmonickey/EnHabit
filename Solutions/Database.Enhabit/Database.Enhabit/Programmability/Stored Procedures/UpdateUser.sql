CREATE PROCEDURE [Enhabit].[UpdateUser]
	@UserId uniqueidentifier,
	@Username VARCHAR(250),
    @Password VARCHAR(250) = NULL,
    @Email VARCHAR(250),
    @FirstName VARCHAR(250),
    @LastName VARCHAR(250),
    @PhoneNumber VARCHAR(250)
AS

BEGIN

SET NOCOUNT ON;

	UPDATE Enhabit.Users
	SET 
		[Username] = @Username, 
		[Email] = @Email, 
		[FirstName] = @FirstName, 
		[LastName] = @LastName, 
		[PhoneNumber] = @PhoneNumber
	WHERE UserId = @UserID

	IF @Password IS NOT NULL
	BEGIN
		UPDATE Enhabit.Users
		SET [Password] = HASHBYTES('SHA1', @Password)
		WHERE UserId = @UserID
	END

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
