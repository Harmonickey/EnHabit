using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BMW
{
	public partial class Universities_AddEdit : Page
	{
		string universityId = "";

		protected void Page_Load(object sender, EventArgs e)
		{
			bool add = bool.TryParse(Request.QueryString["Add"], out add) == true ? add : false;
			universityId = Request.QueryString["UniversityId"];

			if (add)    //Adding new University
			{
				this.UniversityIdLabel.Text = "New UniversityId Will be created upon Submit";
				this.AddUniversityButton.Visible = true;
			}
			else if (!String.IsNullOrEmpty(universityId))	//Load existing University
			{
				LoadUser();
				this.UpdateUniversityButton.Visible = true;
				this.DeleteUniversityButton.Visible = true;
			}
		}

		#region Button Handlers

		protected void AddUserButton_Click(object sender, EventArgs e)
		{
			string insertStatement = "INSERT INTO enhabit.universities (id, name, age) VALUES(1, , 19)";
			try
			{
				//MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//mycon.Open();
				//MySqlCommand mycmd = new MySqlCommand(mySQLStatement, mycon);
				int rowsAffected = 0;	// mycmd.ExecuteNonQuery();
				if (rowsAffected != 1)
				{
					throw new Exception("Inserting failed. Either no rows or more than 1 rows were inserted. Please check. " + rowsAffected + " rows were affected.");
				}
				//mycon.Close();
			}
			catch (Exception ex)
			{
				EventLog logger = new EventLog();
				logger.Source = "EnhabitAdmin";
				logger.WriteEntry("Error: Adding New University Failed, Page: Universities_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		protected void UpdateUserButton_Click(object sender, EventArgs e)
		{
			string insertStatement = "INSERT INTO enhabit.universities (id, name, age) VALUES(1, , 19) ON DUPLICATE KEY UPDATE   nameA, age=19";
			try
			{
				//MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//mycon.Open();
				//MySqlCommand mycmd = new MySqlCommand(mySQLStatement, mycon);
				int rowsAffected = 0;	// mycmd.ExecuteNonQuery();
				if (rowsAffected != 1)
				{
					throw new Exception("Updating failed. Either no rows or more than 1 rows were inserted. Please check. " + rowsAffected + " rows were affected.");
				}
				//mycon.Close();
			}
			catch (Exception ex)
			{
				EventLog logger = new EventLog();
				logger.Source = "EnhabitAdmin";
				logger.WriteEntry("Error: Updating University Failed, Page: Universities_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		protected void DeleteUserButton_Click(object sender, EventArgs e)
		{
			string insertStatement = "DELETE FROM enhabit.universities SHIT";
			try
			{
				//MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//mycon.Open();
				//MySqlCommand mycmd = new MySqlCommand(mySQLStatement, mycon);
				int rowsAffected = 0;	// mycmd.ExecuteNonQuery();
				if (rowsAffected != 1)
				{
					throw new Exception("Deleting failed. Either no rows or more than 1 rows were inserted. Please check. " + rowsAffected + " rows were affected.");
				}
				//mycon.Close();
			}
			catch (Exception ex)
			{
				EventLog logger = new EventLog();
				logger.Source = "EnhabitAdmin";
				logger.WriteEntry("Error: Deleting University Failed, Page: Universities_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		#endregion

		#region Helper Methods

		protected void LoadUser()
		{
			string queryString = "SELECT UniversityId, Name, Address_Street, Address_City, Address_State, Address_Zip, Coordinates_X, Coordinates_Y, ListingDistance, IsActive FROM enhabit.universities WHERE UniversityId = '" + universityId + "';";

			try
			{
				//MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//mycon.Open();
				//MySqlCommand mycmd = new MySqlCommand(mySQLStatement, mycon);
				//using (MySqlDataReader reader = mycmd.ExecuteReader())
				//{
				//	while (reader.Read())
				//	{
				this.UniversityIdLabel.Text = "";		//reader["UniversityId"].ToString();
				this.NameTextbox.Text = "";				//reader["Name"].ToString();
				this.StreetAddressLabel.Text = "";		//reader["Addres_Street"].ToString();
				this.CityAddressLabel.Text = "";		//reader["Addres_City"].ToString();
				this.StateAddressLabel.Text = "";		//reader["Addres_State"].ToString();
				this.ZipAddressLabel.Text = "";			//reader["Addres_Zip"].ToString();
				this.XCoordinatesTextbox.Text = "";		//reader["Coordinates_X"].ToString();
				this.YCoordinatesTextbox.Text = "";		//reader["Coordinates_Y"].ToString();
				this.ListingDistanceTextbox.Text = "";	//reader["ListingDistance"].ToString();
				this.IsActiveCheckBox.Checked = true;	//reader["IsActive"].ToString();	//boolean tryparse this shit
				//	}
				//	reader.Close();
				//}
				//mycon.Close();
			}
			catch (Exception ex)
			{
				EventLog logger = new EventLog();
				logger.Source = "EnhabitAdmin";
				logger.WriteEntry("Error: Load University Failed, Page: Universities_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		#endregion
	}
}