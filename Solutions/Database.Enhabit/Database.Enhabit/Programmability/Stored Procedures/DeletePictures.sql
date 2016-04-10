CREATE PROCEDURE [Enhabit].[DeletePictures]
	@pictureCloudinaryPublicIds TT_PictureCloudinaryPublicIds readonly
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM Enhabit.Pictures
	WHERE CloudinaryPublicId IN (SELECT CloudinaryPublicId FROM @pictureCloudinaryPublicIds);
END
