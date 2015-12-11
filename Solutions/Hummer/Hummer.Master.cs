using System;
using System.Diagnostics;
using System.Web.UI;

namespace Hummer
{
	public partial class SiteMaster : MasterPage
	{
		protected override void OnInit(EventArgs e)
		{
			CheckEventLogSource();
			base.OnInit(e);
		}

		protected void Page_Load(object sender, EventArgs e)
		{
			//Nothing here yet
		}

		private void CheckEventLogSource()
		{
			//Remember you have to add the permision for the server to acces the registry of the key HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/services/EventLog
			//also need to add the source as a reg key in the registry HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/services/EventLog/Application
			// Create the source, if it does not already exist. 
			if (!EventLog.SourceExists("EnhabitAdmin"))
			{
				// An event log source should not be created and immediately used. 
				// There is a latency time to enable the source, it should be created 
				// prior to executing the application that uses the source. 
				// Execute this sample a second time to use the new source.
				EventLog.CreateEventSource("EnhabitAdmin", "EnhabitAdminLog");
				//Console.WriteLine("CreatingEventSource");
				//Console.WriteLine("Exiting, execute the application a second time to use the source.");
				// The source is created.  Exit the application to allow it to be registered.
				return;
			}
		}
	}
}