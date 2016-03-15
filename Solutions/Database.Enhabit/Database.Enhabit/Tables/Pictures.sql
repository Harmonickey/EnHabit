﻿CREATE TABLE [Enhabit].[Pictures]
(
	[PicturesId] uniqueidentifier NOT NULL,
	[PictureName] VARCHAR(250) NOT NULL,
	[CloudinaryUrl] VARCHAR(250) NOT NULL
    CONSTRAINT [PK_Pictures] PRIMARY KEY ([PicturesId] ASC)
)
