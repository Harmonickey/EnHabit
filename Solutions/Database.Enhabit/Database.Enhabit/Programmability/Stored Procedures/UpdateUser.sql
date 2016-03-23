CREATE PROCEDURE [Enhabit].[UpdateUser]
	@UserId uniqueidentifier,
	@Username VARCHAR(250),
    @Password VARCHAR(250),
    @Email VARCHAR(250),
    @FirstName VARCHAR(250),
    @LastName VARCHAR(250),
    @PhoneNumber VARCHAR(250)
AS

BEGIN

SET NOCOUNT ON;

	UPDATE Enhabit.Users
	SET 
		[Username], 
		[Password], 
		[Email], 
		[FirstName], 
		[LastName], 
		[PhoneNumber]
	WHERE UserId = @UserID

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
