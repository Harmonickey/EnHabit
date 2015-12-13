using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BMW
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
				this.UserIdLabel.Text = "New UserId Will be created upon Submit";
				this.AddUserButton.Visible = true;
			}
			else if (!String.IsNullOrEmpty(userId))	//Load existing User
			{
				LoadUser();
				this.UpdateUserButton.Visible = true;
				this.DeleteUserButton.Visible = true;
			}
		}

		#region Button Handlers

		protected void AddUserButton_Click(object sender, EventArgs e)
		{
			string insertStatement = "INSERT INTO enhabit.users (id, name, age) VALUES(1, , 19)";
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
				logger.WriteEntry("Error: Adding New User Failed, Page: Users_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		protected void UpdateUserButton_Click(object sender, EventArgs e)
		{
			string insertStatement = "INSERT INTO enhabit.users (id, name, age) VALUES(1, , 19) ON DUPLICATE KEY UPDATE   nameA, age=19";
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
				logger.WriteEntry("Error: Updating User Failed, Page: Users_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		protected void DeleteUserButton_Click(object sender, EventArgs e)
		{
			string insertStatement = "DELETE FROM USER SHIT";
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
				logger.WriteEntry("Error: Deleting User Failed, Page: Users_AddEdit.aspx" + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}
		}

		#endregion

		#region Helper Methods

		protected void LoadUser()
		{
			string queryString = "SELECT UserId, Username, FacebookId, Name_First, Name_Last, PhoneNumbery, Email, IsVerified, IsActive, FROM enhabit.users WHERE UserId = '" + userId + "';";

			try
			{
				//MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//mycon.Open();
				//MySqlCommand mycmd = new MySqlCommand(mySQLStatement, mycon);
				//using (MySqlDataReader reader = mycmd.ExecuteReader())
				//{
				//	while (reader.Read())
				//	{
				this.UserIdLabel.Text = "";					//reader["UserId"].ToString();
				this.UsernameTextbox.Text = "";				//reader["Username"].ToString();
				this.FacebookIdLabel.Text = "";				//reader["FacebookId"].ToString();
				this.FirstNameTextbox.Text = "";			//reader["Name_First"].ToString();
				this.LastNameTextbox.Text = "";				//reader["Name_Last"].ToString();
				this.PhoneNumerTextbox.Text = "";			//reader["PhoneNumbery"].ToString();
				this.EmailTextbox.Text = "";				//reader["Email"].ToString();
				this.IsVerifiedCheckBox.Checked = true;		//reader["IsVerified"].ToString();	//boolean tryparse this shit
				this.IsActiveCheckBox.Checked = true;		//reader["IsActive"].ToString();	//boolean tryparse this shit
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