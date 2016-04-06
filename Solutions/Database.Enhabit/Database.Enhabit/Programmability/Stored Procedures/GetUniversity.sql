CREATE PROCEDURE [Enhabit].[GetUniversity]
	@UniversityId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT 
		[UniversityId],
		[Name],
		[Address],
		[XCoordinate],
		[YCoordinate],
		[MaxListingDistance],
		[IsActive]
	FROM Enhabit.Universities
	WHERE UniversityId = @UniversityId

END

