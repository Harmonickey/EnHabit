<%@ Page Title="Users" Language="C#" MasterPageFile="~/BMW.Master" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="BMW.Users" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<div>
		<h4>Registered Users</h4>
		<asp:Button ID="AddUserButton" runat="server" ClientIDMode="Static" OnClick="AddUserButton_Click" />
		<asp:GridView ID="UsersGridView" ClientIDMode="Static" runat="server" AutoGenerateColumns="False" AllowPaging="true" PageSize="25" OnPageIndexChanging="UsersGridView_PageIndexChanging">
			<Columns>
				<asp:BoundField HeaderText="First Name" DataField="Name_First" />
				<asp:BoundField HeaderText="Last Name" DataField="Name_Last" />
				<asp:BoundField HeaderText="UserName" DataField="UserName" />
				<asp:BoundField HeaderText="PhoneNumber" DataField="PhoneNumber" />
				<asp:BoundField HeaderText="Email Address" DataField="EmailAddress" />
				<asp:BoundField HeaderText="Verified" DataField="IsVerified" />
				<asp:BoundField HeaderText="Active" DataField="IsActive" />
				<asp:BoundField HeaderText="Deleted" DataField="Deleted" />
				<asp:TemplateField>
					<ItemTemplate>
						<asp:Button ID="ViewUserGutton" Text="Edit User" runat="server" CommandArgument='<% #Eval("UserId")%>' OnClick="ViewUserRow_Click" />
					</ItemTemplate>
				</asp:TemplateField>
			</Columns>
		</asp:GridView>
	</div>
</asp:Content>
