CREATE TABLE [Enhabit].[Universities]
(
	[UniversityId] INT NOT NULL,
	[Name] VARCHAR(250) NOT NULL,
	[Address] VARCHAR(250) NOT NULL,
	[XCoordinate] VARCHAR(250) NOT NULL,
	[YCoordinate] VARCHAR(250) NOT NULL,
	[MaxListingDistance] Decimal(3,2) NOT NULL,
	[IsActive] BIT NOT NULL, 
    CONSTRAINT [PK_Universities] PRIMARY KEY CLUSTERED ([UniversityId])
)
