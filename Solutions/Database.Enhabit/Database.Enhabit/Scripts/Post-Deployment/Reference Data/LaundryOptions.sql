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

MERGE INTO [Enhabit].[LaundryOptions] AS TARGET
USING (VALUES 
	(0, 'None'),
	(1, 'InUnit'),
	(2, 'InBuilding'))
AS SOURCE([LaundryId], [LaundryType])
ON SOURCE.[LaundryId] = TARGET.[LaundryId]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([LaundryId], [LaundryType])
	VALUES ([LaundryId], [LaundryType]);

