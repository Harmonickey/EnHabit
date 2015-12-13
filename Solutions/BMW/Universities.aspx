<%@ Page Title="Universities" Language="C#" MasterPageFile="~/BMW.Master" AutoEventWireup="true" CodeBehind="Universities.aspx.cs" Inherits="BMW.Universities" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
	<div>
		<h4>Registered Users</h4>
		<asp:Button ID="AddUniversityButton" runat="server" ClientIDMode="Static" OnClick="AddUniversityButton_Click" />
		<asp:GridView ID="UniversitiesGridView" ClientIDMode="Static" runat="server" AutoGenerateColumns="False" AllowPaging="true" PageSize="25" OnPageIndexChanging="UniversitiesGridView_PageIndexChanging">
			<Columns>
				<asp:BoundField HeaderText="University Name" DataField="Name" />
				<asp:BoundField HeaderText="University Address" DataField="Address" />
				<asp:BoundField HeaderText="Listing Distance (miles)" DataField="ListingDistance" />
				<asp:BoundField HeaderText="Is Active" DataField="IsActive" />
				<asp:TemplateField>
					<ItemTemplate>
						<asp:Button ID="ViewUniversityButton" Text="Edit User" runat="server" CommandArgument='<% #Eval("UniversityId")%>' OnClick="ViewUniversityRow_Click" />
					</ItemTemplate>
				</asp:TemplateField>
			</Columns>
		</asp:GridView>
	</div>
</asp:Content>
