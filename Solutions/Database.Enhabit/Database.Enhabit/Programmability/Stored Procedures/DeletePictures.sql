CREATE PROCEDURE [Enhabit].[DeletePictures]
	@pictureUrls TT_PictureUrls readonly
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM Enhabit.Pictures
	WHERE CloudinaryUrl IN (SELECT CloudinaryUrl FROM @pictureUrls);
END
