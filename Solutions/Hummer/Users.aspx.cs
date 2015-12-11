﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Hummer
{
	public partial class Users : Page
	{
		List<UsersGridData> usersGridData = new List<UsersGridData>();

		protected void Page_Load(object sender, EventArgs e)
		{
			SetUpUsersGrid();
		}

		#region Button Handlers

		protected void UsersGridViewButton_Click(object sender, EventArgs e)
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

			string queryString = "SELECT ALL THE FUCKING USERS";

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
					FirstName = "",		//reader["Name_First"].ToString()
					LastName = "",		//reader["Name_Last"].ToString()
					UserName = "",		//reader["UserName"].ToString()
					PhoneNumber = "",	//reader["PhoneNumber"].ToString()
					EmailAddress = "",	//reader["EmailAddress"].ToString()
					UserID = ""			//reader["UserID"].ToString()
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
			public string FirstName { get; set; }
			public string LastName { get; set; }
			public string UserName { get; set; }
			public string PhoneNumber { get; set; }
			public string EmailAddress { get; set; }
			public string UserID { get; set; }
		}

		#endregion


	}
}