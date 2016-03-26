using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BMW
{
	public partial class Universities : Page
	{
		List<UniversitiesGridData> universitiesGridData = new List<UniversitiesGridData>();

		protected void Page_Load(object sender, EventArgs e)
		{
			SetUpUniversitiesGrid();
		}

		#region Button Handlers

		protected void ViewUniversityRow_Click(object sender, EventArgs e)
		{
			Response.Redirect("/Universities_AddEdit?UserId=" + ((Button)sender).CommandArgument);
		}

		protected void AddUniversityButton_Click(object sender, EventArgs e)
		{
			Response.Redirect("/Universities_AddEdit?Add=true");
		}

		#endregion

		#region Helper Methods

		protected void UsersGridView_PageIndexChanging(object sender, GridViewPageEventArgs e)
		{
			this.UniversitiesGridView.PageIndex = e.NewPageIndex;
			SetUpUniversitiesGrid();
		}

		#endregion

		#region DataSources

		private void SetUpUniversitiesGrid()
		{

			string queryString = "SELECT ALL THE FUCKING Universities";

			try
			{
				//	MySqlConnection mycon = new MySqlConnection(ConfigurationManager.ConnectionStrings["mfs"].ToString());
				//	mycon.Open();
				//	MySqlCommand mycmd = new MySqlCommand(queryString, mycon);
				//	using (MySqlDataReader reader = mycmd.ExecuteReader())
				//	{
				//		while (reader.Read())
				//		{
				UniversitiesGridData user = new UniversitiesGridData()
				{
					UniversityId = "",		//reader["UniversityId"].ToString()
					Name = "",				//reader["Name"].ToString()
					Address = "",			//reader["Address_Street"].ToString() + //reader["Address_City"].ToString() + //reader["Address_State"].ToString()
					ListingDistance = "",	//reader["ListingDistance"].ToString()
					IsActive = ""			//reader["IsActive"].ToString()
				};
				universitiesGridData.Add(user);
				//		}
				//		reader.Close();
				//	}
				//	mycon.Close();
			}
			catch (Exception ex)
			{
				EventLog logger = new EventLog();
				logger.Source = "EnhabitAdmin";
				logger.WriteEntry("Error: Load Universities Failed, Page: Universities.aspx, " + Environment.NewLine + ex.ToString(), EventLogEntryType.Error);
			}

			this.UniversitiesGridView.DataSource = universitiesGridData;
			this.UniversitiesGridView.DataBind();
		}

		#endregion

		#region DataClasses

		public class UniversitiesGridData
		{
			public string UniversityId { get; set; }
			public string Name { get; set; }
			public string Address { get; set; }
			public string ListingDistance { get; set; }
			public string IsActive { get; set; }
		}

		#endregion
	}
}