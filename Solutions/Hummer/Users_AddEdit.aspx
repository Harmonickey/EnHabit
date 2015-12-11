<%@ Page Title="Edit User" Language="C#" MasterPageFile="~/Hummer.Master" AutoEventWireup="true" CodeBehind="Users_AddEdit.aspx.cs" Inherits="Hummer.Users_AddEdit" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<div>
		text fields and shit
        also update and delete button

		<asp:Button ID="AddUserButton" runat="server" ClientIDMode="Static" OnClick="AddUserButton_Click" />
		<asp:Button ID="UpdateUserButton" runat="server" ClientIDMode="Static" OnClick="UpdateUserButton_Click" />
	</div>
</asp:Content>
