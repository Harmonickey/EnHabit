CREATE PROCEDURE [Enhabit].[SavePicture]
	@PicturesId uniqueidentifier,
	@CloudinaryUrl VARCHAR(250)
AS
BEGIN

SET NOCOUNT ON;

INSERT INTO Enhabit.Pictures(PicturesId, CloudinaryUrl)
VALUES(@PicturesId, @CloudinaryUrl);

END
