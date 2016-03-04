CREATE TABLE [Enhabit].[Payments]
(
	[PaymentId] uniqueidentifier NOT NULL,
	[RenterId] uniqueidentifier NOT NULL,
	[LandlordId] uniqueidentifier NOT NULL,
	[ListingId] uniqueidentifier NOT NULL,
	[PaypalTransactionId] VARCHAR(250) NOT NULL,
	[AmountPaid] Decimal(6,2) NOT NULL,
	[Date] DATETIME NOT NULL,
	[Notes] VARCHAR(250) NULL, 
    CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED ([PaymentId]), 
    CONSTRAINT [FK_PaymentsRenter_ToUsers] FOREIGN KEY ([RenterId]) REFERENCES [Enhabit].[Users]([UserId]), 
    CONSTRAINT [FK_PaymentsLandlord_ToUsers] FOREIGN KEY ([LandlordId]) REFERENCES [Enhabit].[Users]([UserId]), 
    CONSTRAINT [FK_PaymentsListing_ToListings] FOREIGN KEY ([ListingId]) REFERENCES [Enhabit].[Listings]([ListingId])


)
