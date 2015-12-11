<%@ Page Title="Listings" Language="C#" MasterPageFile="~/Hummer.Master" AutoEventWireup="true" CodeBehind="Listings.aspx.cs" Inherits="Hummer.Listings" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<asp:Panel ID="ListingsTest" runat="server" Visible="false">
		autogenerate stuff here
	</asp:Panel>

	<div>
		<h4>Listings</h4>
		add listings button
        remove old listings button(removes listings 2+years old without renter)
        <asp:GridView ID="ListingsGridView" ClientIDMode="Static" runat="server" AutoGenerateColumns="false" OnRowCommand="ListingsGridViewButton_Click">
			<Columns>
				<asp:BoundField HeaderText="LandlordFirst Name" DataField="FirstName" />
				<asp:BoundField HeaderText="Last Name" DataField="LastName" />
				<asp:BoundField HeaderText="UserName" DataField="UserName" />
				<asp:BoundField HeaderText="PhoneNumber" DataField="PhoneNumber" />
				<asp:BoundField HeaderText="Email Address" DataField="EmailAddress" />
				<asp:ButtonField Text="Edit User" ButtonType="Button" HeaderText="View" CommandName="View" DataTextField="WIN" />
			</Columns>
		</asp:GridView>
	</div>
</asp:Content>
