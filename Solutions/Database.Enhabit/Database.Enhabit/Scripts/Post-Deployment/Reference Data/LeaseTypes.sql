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

MERGE INTO [Enhabit].[LeaseTypes] AS TARGET
USING (VALUES 
	(0, 'Sublet'),
	(1, 'Rental'))
AS SOURCE([LeaseTypeId], [LeaseType])
ON SOURCE.[LeaseTypeId] = TARGET.[LeaseTypeId]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([LeaseTypeId], [LeaseType])
	VALUES ([LeaseTypeId], [LeaseType]);

