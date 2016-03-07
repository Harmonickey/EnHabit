/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

MERGE INTO [Enhabit].[AccountTypes] AS TARGET
USING (VALUES 
	(0, 'Admin'),
	(1, 'Landlord'),
	(2, 'Tenant'))
AS SOURCE([AccountTypeId], [AccountType])
ON SOURCE.[AccountTypeId] = TARGET.[AccountTypeId]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([AccountTypeId], [AccountType])
	VALUES ([AccountTypeId], [AccountType]);
