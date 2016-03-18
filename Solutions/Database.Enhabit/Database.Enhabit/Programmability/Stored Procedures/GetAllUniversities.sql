CREATE PROCEDURE [Enhabit].[GetUniversities]
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

END

