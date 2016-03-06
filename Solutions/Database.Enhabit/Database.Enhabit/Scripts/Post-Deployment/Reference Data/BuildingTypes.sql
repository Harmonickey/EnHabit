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

MERGE INTO [Enhabit].[BuildingTypes] AS TARGET
USING (VALUES 
	(0, 'Apartment'),
	(1, 'House'))
AS SOURCE([BuildingTypeId], [BuildingType])
ON SOURCE.[BuildingTypeId] = TARGET.[BuildingTypeId]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([BuildingTypeId], [BuildingType])
	VALUES ([BuildingTypeId], [BuildingType]);

