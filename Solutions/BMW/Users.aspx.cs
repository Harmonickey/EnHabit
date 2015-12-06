using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BMW
{
	public partial class Users : Page
	{
		List<UsersGridData> usersGridData = new List<UsersGridData>();

		protected void Page_Load(object sender, EventArgs e)
		{
			SetUpUsersGrid();
		}

		#region Button Handlers

		protected void ViewUserRow_Click(object sender, EventArgs e)
		{
			Response.Redirect("/Users_AddEdit?UserId=" + ((Button)sender).CommandArgument);
		}

		protected void AddUserButton_Click(object sender, EventArgs e)
		{
			Response.Redirect("/Users_AddEdit?Add=true");
		}

		#endregion

		#region Helper Methods

		protected void UsersGridView_PageIndexChanging(object sender, GridViewPageEventArgs e)
		{
			this.UsersGridView.PageIndex = e.NewPageIndex;
			SetUpUsersGrid();
		}

		#endregion

		#region DataSources

		private void SetUpUsersGrid()
		{

            string queryString = "SELECT UserId, AccountType, FirstName, LastName, UserName, PhoneNumber, Email, IsVerified, IsActive " +
                "FROM Users AS users" +
                    "JOIN AccountTypes AS types ON users.AccountTypeId = types.AccountTypeId " +
                "GROUP BY IsVerified;";

			try
			{
				//	MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//	mycon.Open();
				//	MySqlCommand mycmd = new MySqlCommand(queryString, mycon);
				//	using (MySqlDataReader reader = mycmd.ExecuteReader())
				//	{
				//		while (reader.Read())
				//		{
				UsersGridData user = new UsersGridData()
				{
					UserId = "",		//reader["UserId"].ToString()
                    AccountType = "",   //int.Parse(reader["AccountType"]).ToString()
                    FirstName = "",	    //reader["FirstName"].ToString()
					LastName = "",		//reader["LastName"].ToString()
					UserName = "",		//reader["UserName"].ToString()
					PhoneNumber = "",	//reader["PhoneNumber"].ToString()
					Email = "",	        //reader["Email"].ToString()
					IsVerified = "",	//reader["IsVerified"].ToString()
					IsActive = "",		//reader["IsActive"].ToString()
				};
				usersGridData.Add(user);
				//		}
				//		reader.Close();
				//	}
				//	mycon.Close();
			}
			catch (Exception ex)
			{
				EventLog logger = new EventLog();
				logger.Source = "EnhabitAdmin";
				logger.WriteEntry("Error: Load Users Failed, Page: Users.aspx, " + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}

			this.UsersGridView.DataSource = usersGridData;
			this.UsersGridView.DataBind();
		}

		#endregion

		#region DataClasses

		public class UsersGridData
		{
			public string UserId { get; set; }
            public string AccountType { get; set; }
			public string FirstName { get; set; }
			public string LastName { get; set; }
            public string UserName { get; set; }
			public string PhoneNumber { get; set; }
			public string Email { get; set; }
			public string IsVerified { get; set; }
			public string IsActive { get; set; }
		}

		#endregion
	}
}