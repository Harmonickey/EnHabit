CREATE TABLE [Enhabit].[Pictures]
(
	[PicturesId] uniqueidentifier NOT NULL,
	[CloudinaryId] int NOT NULL,
	[IsThumbnail] BIT NOT NULL, 
    CONSTRAINT [PK_Pictures] PRIMARY KEY ([PicturesId] ASC)
)
