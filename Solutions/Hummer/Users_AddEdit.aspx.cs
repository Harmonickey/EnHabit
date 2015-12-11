using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Hummer
{
	public partial class Users_AddEdit : Page
	{
		string userId = "";

		protected void Page_Load(object sender, EventArgs e)
		{
			bool add = bool.TryParse(Request.QueryString["Add"], out add) == true ? add : false;
			userId = Request.QueryString["UserId"];

			if (add)    //Adding new User
			{
				//this.UserIdLabel.Text = WIN;
			}
			else if (!String.IsNullOrEmpty(userId))    //Load existing User
			{
				//this.UserIdLabel.Text = WIN;
				LoadUser();
			}
		}

		#region Button Handlers

		protected void UpdateUser_Click(object sender, EventArgs e)
		{
			string insertStatement = "INSERT INTO table (id, name, age) VALUES(1, , 19) ON DUPLICATE KEY UPDATE   nameA, age=19";
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
				logger.WriteEntry("Error: Inserting User Data Failed, Page: Users_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		#endregion

		#region Helper Methods

		protected void LoadUser()
		{
			string queryString = "SELECT Name_First, Name_Middle, Name_Last, Phone_Primary, Phone_Secondary, Birthdate, Email, Gender, Ethnicity, WMUEnrollmentDate, MfSSignupDate, ContactType, Alpha, ";

			try
			{
				//MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//mycon.Open();
				//MySqlCommand mycmd = new MySqlCommand(mySQLStatement, mycon);
				//using (MySqlDataReader reader = mycmd.ExecuteReader())
				//{
				//	while (reader.Read())
				//	{
				//		FirstNameLabel.Text = reader["Name_First"].ToString();
				//		MiddleNameLabel.Text = reader["Name_Middle"].ToString();
				//		LastNameLabel.Text = reader["Name_Last"].ToString();
				//		WINLabel.Text = WIN;
				//	}
				//	reader.Close();
				//}
				//mycon.Close();
			}
			catch (Exception ex)
			{
				EventLog logger = new EventLog();
				logger.Source = "EnhabitAdmin";
				logger.WriteEntry("Error: Load User Failed, Page: Users_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		#endregion
	}
}