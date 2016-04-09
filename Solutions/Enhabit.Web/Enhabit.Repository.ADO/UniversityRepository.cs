﻿using Enhabit.Repository.Contracts;
using Enhabit.Models;
using System.Data.SqlClient;
using Enhabit.Presenter.DataAdaptors;
using System;
using System.Collections.Generic;
using System.Data;

namespace Enhabit.Repository.ADO
{
    public class UniversityRepository : IUniversityRepository
    {
        private readonly string _enhabitConnString;
        
        public UniversityRepository(IConfigAdaptor configAdaptor)
        {
            if (configAdaptor == null) throw new ArgumentNullException("configAdaptor");

            _enhabitConnString = configAdaptor.EnhabitConnectionString;
        }

        public IEnumerable<University> GetAllUniversities()
        {
            var universities = new List<University>();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetAllUniversities]";
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        universities.Add(new University
                        {
                            UniversityId = (Guid)reader["UniversityId"],
                            Name = reader["Name"].ToString(),
                            MaxListingDistance = decimal.Parse(reader["MaxListingDistance"].ToString()),
                            Address = reader["Address"].ToString(),
                            XCoordinate = reader["XCoordinate"].ToString(),
                            YCoordinate = reader["YCoordinate"].ToString()
                        });
                    }
                }
            }

            return universities;
        }

        public University GetUniversity(Guid universityId)
        {
            var university = new University();

            using (var SqlConn = new SqlConnection(_enhabitConnString))
            {
                SqlConn.Open();
                using (var cmd = SqlConn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "[Enhabit].[GetUniversity]";
                    cmd.Parameters.AddWithValue("@UniversityId", universityId);
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows && reader.Read())
                    {
                        university.UniversityId = (Guid)reader["UniversityId"];
                        university.Name = reader["Name"].ToString();
                        university.MaxListingDistance = decimal.Parse(reader["MaxListingDistance"].ToString());
                        university.Address = reader["Address"].ToString();
                        university.XCoordinate = reader["XCoordinate"].ToString();
                        university.YCoordinate = reader["YCoordinate"].ToString();
                    }
                }
            }

            return university;
        }
    }
}