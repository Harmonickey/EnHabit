CREATE TABLE [Enhabit].[Listings]
(
	[ListingId] uniqueidentifier NOT NULL,
	[UserId] uniqueidentifier NOT NULL, 
	[UniversityId] uniqueidentifier NOT NULL,
	[Address] VARCHAR(250) NOT NULL,
	[Unit] VARCHAR(10) NULL,
	[XCoordinate] VARCHAR(250) NOT NULL,
	[YCoordinate] VARCHAR(250) NOT NULL,
	[Price] DECIMAL(6,2) NOT NULL,
	[Bedrooms] INT NOT NULL,
	[Bathrooms] INT NOT NULL,
	[PetId] INT NOT NULL,
	[LaundryId] INT NOT NULL,
	[ParkingId] INT NOT NULL,
	[HasAirConditioning] BIT NOT NULL,
	[LeaseTypeId] INT NOT NULL,
	[BuildingTypeId] VARCHAR(250) NOT NULL,
	[StartDate] DATETIME NOT NULL,
	[IsRented] BIT NOT NULL,
	[IsFeatured] BIT NOT NULL,
	CONSTRAINT [PK_Listings] PRIMARY KEY CLUSTERED ([ListingId] ASC),
    CONSTRAINT [FK_ListingsUser_ToUsers] FOREIGN KEY ([UserId]) REFERENCES [Enhabit].[Users]([UserId])
)