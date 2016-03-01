CREATE PROCEDURE [Enhabit].[GetListingsPictures]
	@PictureIds TT_PictureIds readonly
AS
BEGIN

SET NOCOUNT ON;

	SELECT 
		p.PicturesId,
		p.CloudinaryUrl,
		p.CloudinaryPublicId
	FROM Enhabit.Pictures p
	INNER JOIN @PictureIds i ON i.PictureId = p.PicturesId

END
