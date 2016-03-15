CREATE TABLE [Enhabit].[Users]
(
	[UserId] uniqueidentifier NOT NULL,
	[AccountTypeId] INT NOT NULL,
	[Username] VARCHAR(250) NULL,
	[FacebookId] VARCHAR(250) NULL,
	[Password] VARCHAR(250) NOT NULL,
	[FirstName] VARCHAR(250) NOT NULL,
	[LastName] VARCHAR(250) NOT NULL,
	[PhoneNumber] VARCHAR(250) NULL,
	[Email] VARCHAR(250) NOT NULL,
	[IsVerified] BIT NOT NULL,
	[IsActive] BIT NOT NULL, 
	CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserId] ASC),
    CONSTRAINT [FK_Users_ToTable] FOREIGN KEY ([AccountTypeId]) REFERENCES [Enhabit].[AccountTypes]([AccountTypeId]),
    CONSTRAINT [UC_EnhabitUsername] UNIQUE ([Username]),
	CONSTRAINT [UC_EnhabitEmail] UNIQUE ([Email])
)


