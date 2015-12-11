<%@ Page Title="Users" Language="C#" MasterPageFile="~/Hummer.Master" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="Hummer.Users" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<div>
		<h4>Registered Users</h4>
		<asp:Button ID="AddUserButton" runat="server" ClientIDMode="Static" OnClick="AddUserButton_Click" />
		<asp:GridView ID="UsersGridView" ClientIDMode="Static" runat="server" AutoGenerateColumns="False" AllowPaging="true" PageSize="25" OnPageIndexChanging="UsersGridView_PageIndexChanging">
			<Columns>
				<asp:BoundField HeaderText="First Name" DataField="FirstName" />
				<asp:BoundField HeaderText="Last Name" DataField="LastName" />
				<asp:BoundField HeaderText="UserName" DataField="UserName" />
				<asp:BoundField HeaderText="PhoneNumber" DataField="PhoneNumber" />
				<asp:BoundField HeaderText="Email Address" DataField="EmailAddress" />
				<asp:TemplateField>
					<ItemTemplate>
						<asp:Button ID="ViewUserGutton" Text="Edit User" runat="server" CommandArgument='<% #Eval("UserID")%>' OnClick="ViewUserRow_Click" />
					</ItemTemplate>
				</asp:TemplateField>
			</Columns>
		</asp:GridView>
	</div>
</asp:Content>
