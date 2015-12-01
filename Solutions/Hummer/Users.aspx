<%@ Page Title="Users" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="Hummer.Users" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
        <h4>Registered Users</h4>
        <asp:GridView ID="UsersGridView" ClientIDMode="Static" runat="server" AutoGenerateColumns="false" onrowcommand="UsersGridViewButton_Click" >
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
