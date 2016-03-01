CREATE PROCEDURE [Enhabit].[SavePicture]
	@PicturesId uniqueidentifier,
	@CloudinaryUrl VARCHAR(250),
	@CloudinaryPublicId VARCHAR(250)
AS
BEGIN

SET NOCOUNT ON;

INSERT INTO Enhabit.Pictures(PicturesId, CloudinaryUrl, CloudinaryPublicId)
VALUES(@PicturesId, @CloudinaryUrl, @CloudinaryPublicId);

END
