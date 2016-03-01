CREATE PROCEDURE [Enhabit].[GetPriceRange]
AS
BEGIN

SET NOCOUNT ON;
	
	SELECT MIN(Price) AS LOW, MAX(Price) AS HIGH
	FROM Enhabit.Listings

END
