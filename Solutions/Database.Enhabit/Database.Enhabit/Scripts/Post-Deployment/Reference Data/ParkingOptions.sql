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

MERGE INTO [Enhabit].[ParkingOptions] AS TARGET
USING (VALUES 
	(0, 'None'),
	(1, 'Garage'),
	(2, 'OutsidePrivateLot'),
	(3, 'Street'))
AS SOURCE([ParkingId], [ParkingType])
ON SOURCE.[ParkingId] = TARGET.[ParkingId]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([ParkingId], [ParkingType])
	VALUES ([ParkingId], [ParkingType]);

