CREATE TABLE [Enhabit].[EnhabitCharges]
(
	[EnhabitChargesId] INT NOT NULL,
	[UniversityId] INT NOT NULL,
	[ListingMarkupPercent] DECIMAL(4,4) NOT NULL,
	[FeaturedMarkupPercent] DECIMAL(4,4) NOT NULL, 
    CONSTRAINT [PK_EnhabitCharges] PRIMARY KEY ([EnhabitChargesId]), 
    CONSTRAINT [FK_EnhabitChargesUniversity_ToUniversities] FOREIGN KEY ([UniversityId]) REFERENCES [Enhabit].[Universities]([UniversityId])
)