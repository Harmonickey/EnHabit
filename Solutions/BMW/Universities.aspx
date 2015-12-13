<%@ Page Title="Universities" Language="C#" MasterPageFile="~/BMW.Master" AutoEventWireup="true" CodeBehind="Universities.aspx.cs" Inherits="BMW.Universities" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<div>
		<h4>Registered Universities</h4>
		<asp:GridView ID="UniversitiesGridView" ClientIDMode="Static" runat="server" AutoGenerateColumns="false" OnRowCommand="UniversitiesGridViewButton_Click">
			<Columns>
				<asp:BoundField HeaderText="First Name" DataField="FirstName" />
				<asp:BoundField HeaderText="Last Name" DataField="LastName" />
				<asp:BoundField HeaderText="UserName" DataField="UserName" />
				<asp:BoundField HeaderText="PhoneNumber" DataField="PhoneNumber" />
				<asp:BoundField HeaderText="Email Address" DataField="EmailAddress" />
				<asp:ButtonField Text="Edit User" ButtonType="Button" HeaderText="View" CommandName="View" DataTextField="WIN" />
			</Columns>
		</asp:GridView>
	</div>
</asp:Content>
