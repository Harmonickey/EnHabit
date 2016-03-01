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
{
        "_id" : ObjectId("5665347212cc1dd4e4c3adea"),
        "UniversityId" : "5922e318-b862-4660-a546-69c987ff081a",
        "UniversityName" : "Northwestern",
        "Address" : "633 Clark Street, Evanston, IL, United States",
        "WorldCoordinates" : {
                "x" : 42.05040640000001,
                "y" : -87.6795449
        },
        "Threshold" : "20.0000"
}
*/

MERGE INTO [Enhabit].[Universities] AS TARGET
USING (VALUES 
	('5922e318-b862-4660-a546-69c987ff081a', 'Northwestern', '633 Clark Street, Evanston, IL, United States', '42.05040640000001', '-87.6795449', '20.0000', 1))
AS SOURCE([UniversityId], [Name], [Address], [XCoordinate], [YCoordinate], [MaxListingDistance], [IsActive])
ON SOURCE.[UniversityId] = TARGET.[UniversityId]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([UniversityId], [Name], [Address], [XCoordinate], [YCoordinate], [MaxListingDistance], [IsActive])
	VALUES ([UniversityId], [Name], [Address], [XCoordinate], [YCoordinate], [MaxListingDistance], [IsActive]);