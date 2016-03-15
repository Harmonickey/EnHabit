CREATE PROCEDURE [Enhabit].[SavePicture]
	@PicturesId uniqueidentifier,
	@PictureName VARCHAR(250),
	@CloudinaryUrl VARCHAR(250)
AS
BEGIN

SET NOCOUNT ON;

INSERT INTO Enhabit.Pictures(PicturesId, PictureName, CloudinaryUrl)
VALUES(@PicturesId, @PictureName, @CloudinaryUrl);

END
