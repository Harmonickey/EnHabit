CREATE PROCEDURE [Enhabit].[GetPictures]
	@PicturesId uniqueidentifier
AS
BEGIN

SET NOCOUNT ON;

	SELECT CloudinaryUrl
	FROM Enhabit.Pictures
	WHERE PicturesId = @PicturesId

END
