<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Hummer.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Hummer._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<h1>Site Analytics</h1>
	<div>
		<h3>Site Statistics</h3>
		<div>
			<ol>
				<li>site hits Today</li>
				<li>% of new Unique hits today(total/Unique & New)</li>
				<li>yesterday Today</li>
				<li>% of new Unique hits yesterday(total/Unique yesterday & New yesterday)</li>
				<li>all-time Today</li>
				<li>Unique site hits Today</li>
				<li>Unique yesterday Today</li>
				<li>Unique all-time Today</li>
				<li>Average PageLoad Time</li>
			</ol>
		</div>
		<h3>Listings</h3>
		<div>
			<ol>
				<li>Total Active Listings on System Now</li>
				<li>Total Active Listings on System Ever</li>
				<li>Total Active Listings on System by Landlords</li>
				<li>Total Active Listings on System by Tenants</li>
				<li>Total Active Listings that are Sublets</li>
				<li>Total Active Listings that are Apartments</li>
			</ol>
		</div>
		<h3>Search Statistics</h3>
		<div>
			<ol>
				<li># of searches made today</li>
				<li># of searches made yesterday</li>
				<li># of searches all-time</li>
			</ol>
		</div>
		<h3>Usage Statistics</h3>
		<div>
			<ol>
				<li>Number of Listings Viewed Today</li>
				<li>Number of Listings Viewed Yesterday</li>
				<li>Number of Listings Viewed All-time</li>
				<li>Total Users Ever</li>
				<li>Total Payments Made</li>
				<li>Average Time on Site</li>
			</ol>
		</div>
	</div>
</asp:Content>
