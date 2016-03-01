CREATE PROCEDURE [Enhabit].[CreateUser]
	@UserId uniqueidentifier,
	@Username VARCHAR(250),
    @Password VARCHAR(250),
    @Email VARCHAR(250),
    @FirstName VARCHAR(250),
    @LastName VARCHAR(250),
    @PhoneNumber VARCHAR(250),
	@AccountTypeId INT,
	@IsActive BIT,
	@IsVerified BIT
AS

BEGIN 

SET NOCOUNT ON;

	INSERT INTO Enhabit.Users([UserId], [Username], [Password], [Email], [FirstName], [LastName], [PhoneNumber], [AccountTypeId], [IsActive], [IsVerified])
	VALUES(@UserId, @Username, HASHBYTES('SHA1', @Password), @Email, @FirstName, @LastName, @PhoneNumber, @AccountTypeId, @IsActive, @IsVerified);
END
