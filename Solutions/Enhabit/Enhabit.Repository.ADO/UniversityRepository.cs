using Enhabit.Models;
using Enhabit.Repository.Contracts;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Enhabit.Repository.ADO
{
    public class UniversityRepository : IUniversityRepository
    {
        public IEnumerable<University> GetAllUniversities()
        {
            var universities = new List<University>();

            using (var cmd = new SqlCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[Enhabit].[GetUniversities]";
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.HasRows && reader.Read())
                {
                    universities.Add(new University
                    {
                        Name = reader["Name"].ToString(),
                        Threshold = (decimal)reader["Threshold"]
                    });
                }
            }

            return universities;
        }
    }
}
