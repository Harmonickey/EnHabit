CREATE TABLE [Enhabit].[Renters]
(
	[RenterId] uniqueidentifier NOT NULL,
	[UserId] uniqueidentifier NOT NULL,
	[ListingId] uniqueidentifier NOT NULL,
	[HasPaid] BIT NOT NULL,
	[RentDueDate] DATETIME NOT NULL, 
    CONSTRAINT [PK_Renters] PRIMARY KEY CLUSTERED ([RenterId]), 
    CONSTRAINT [FK_RentersUser_ToUsers] FOREIGN KEY ([UserId]) REFERENCES [Enhabit].[Users]([UserId]), 
    CONSTRAINT [FK_RentersListing_ToListings] FOREIGN KEY ([ListingId]) REFERENCES [Enhabit].[Listings]([ListingId])
)
