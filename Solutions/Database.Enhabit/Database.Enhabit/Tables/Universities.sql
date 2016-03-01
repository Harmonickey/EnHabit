CREATE TABLE [Enhabit].[Universities]
(
	[UniversityId] uniqueidentifier NOT NULL,
	[Name] VARCHAR(250) NOT NULL,
	[Address] VARCHAR(250) NOT NULL,
	[XCoordinate] VARCHAR(250) NOT NULL,
	[YCoordinate] VARCHAR(250) NOT NULL,
	[MaxListingDistance] VARCHAR(250) NOT NULL,
	[IsActive] BIT NOT NULL, 
    CONSTRAINT [PK_Universities] PRIMARY KEY CLUSTERED ([UniversityId] ASC)
)
