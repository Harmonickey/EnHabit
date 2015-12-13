﻿<%@ Page Title="Edit User" Language="C#" MasterPageFile="~/Hummer.Master" AutoEventWireup="true" CodeBehind="Users_AddEdit.aspx.cs" Inherits="Hummer.Users_AddEdit" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<div class="jumbotron">
		<asp:Label Text="UserId:" runat="server" />
		<asp:Label ID="UserIdLabel" runat="server" ClientIDMode="Static" />
		<asp:Label Text="UserName:" runat="server" />
		<asp:TextBox ID="UsernameTextbox" runat="server" ClientIDMode="Static" />
		<asp:Label Text="FacebookId:" runat="server" />
		<asp:Label ID="FacebookIdLabel" runat="server" ClientIDMode="Static" />
		<asp:Label Text="First Name:" runat="server" />
		<asp:TextBox ID="FirstNameTextbox" runat="server" ClientIDMode="Static" />
		<asp:Label Text="Last Name:" runat="server" />
		<asp:TextBox ID="LastNameTextbox" runat="server" ClientIDMode="Static" />
		<asp:Label Text="Phone Number:" runat="server" />
		<asp:TextBox ID="PhoneNumerTextbox" runat="server" ClientIDMode="Static" />
		<asp:Label Text="Email:" runat="server" />
		<asp:TextBox ID="EmailTextbox" runat="server" ClientIDMode="Static" />
		<asp:CheckBox ID="IsVerifiedCheckBox" Text="Is Verified:" runat="server" ClientIDMode="Static" />
		<asp:CheckBox ID="IsActiveCheckBox" Text="Is Verified:" runat="server" ClientIDMode="Static" />
		<asp:CheckBox ID="DeletedCheckBox" Text="Deleted:" runat="server" ClientIDMode="Static" />
		<asp:Button ID="AddUserButton" runat="server" ClientIDMode="Static" Visible="false" OnClick="AddUserButton_Click" />
		<asp:Button ID="UpdateUserButton" runat="server" ClientIDMode="Static" Visible="false" OnClick="UpdateUserButton_Click" />
		<p>To truely delete this user, please do so through the PurgeDeletedUser SPROC</p>
	</div>
</asp:Content>
