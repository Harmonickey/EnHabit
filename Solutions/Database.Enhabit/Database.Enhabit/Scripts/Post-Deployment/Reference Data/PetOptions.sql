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

MERGE INTO [Enhabit].[PetOptions] AS TARGET
USING (VALUES 
	(0, 'None'),
	(1, 'Cats'),
	(2, 'Dogs'))
AS SOURCE([PetId], [PetType])
ON SOURCE.[PetId] = TARGET.[PetId]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([PetId], [PetType])
	VALUES ([PetId], [PetType]);

