<%@ Page Title="Edit User" Language="C#" MasterPageFile="~/BMW.Master" AutoEventWireup="true" CodeBehind="Universities_AddEdit.aspx.cs" Inherits="BMW.Universities_AddEdit" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<div class="jumbotron">
		<asp:Label Text="UniversityId:" runat="server" />
		<asp:Label ID="UniversityIdLabel" runat="server" ClientIDMode="Static" />
		<asp:Label Text="Name:" runat="server" />
		<asp:TextBox ID="NameTextbox" runat="server" ClientIDMode="Static" />
		<asp:Label Text="Street Address:" runat="server" />
		<asp:TextBox ID="StreetAddressLabel" runat="server" ClientIDMode="Static" />
		<asp:Label Text="City Address:" runat="server" />
		<asp:TextBox ID="CityAddressLabel" runat="server" ClientIDMode="Static" />
		<asp:Label Text="State Address:" runat="server" />
		<asp:TextBox ID="StateAddressLabel" runat="server" ClientIDMode="Static" />
		<asp:Label Text="Zip Address:" runat="server" />
		<asp:TextBox ID="ZipAddressLabel" runat="server" ClientIDMode="Static" />
		<asp:Label Text="X Coordinates:" runat="server" />
		<asp:Label ID="XCoordinatesTextbox" runat="server" ClientIDMode="Static" />
		<asp:Label Text="X Coordinates:" runat="server" />
		<asp:Label ID="YCoordinatesTextbox" runat="server" ClientIDMode="Static" />
		<asp:Label Text="Listing Distance:" runat="server" />
		<asp:TextBox ID="ListingDistanceTextbox" runat="server" ClientIDMode="Static" />
		<asp:CheckBox ID="IsActiveCheckBox" Text="Is Verified:" runat="server" ClientIDMode="Static" />
		<asp:Button ID="AddUniversityButton" runat="server" ClientIDMode="Static" Visible="false" OnClick="AddUniversityButton_Click" />
		<asp:Button ID="UpdateUniversityButton" runat="server" ClientIDMode="Static" Visible="false" OnClick="UpdateUniversityButton_Click" />
		<asp:Button ID="DeleteUniversityButton" runat="server" ClientIDMode="Static" Visible="false" OnClick="DeleteUniversityButton_Click" />
	</div>
</asp:Content>
