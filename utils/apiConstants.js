export const BASE_URL = "https://QAwhatsappapi.consulttechies.com"
export const LOGINAPI = "/User/Login";
export const REFRESHTOKENAPI = "/Token/Refresh";
export const DASHBOARDSUMMARY = "/Dashboard/getdashboardsummary";
export const DASHBOARDREPORT="/Dashboard/getdashboardreportsummary";
// Clients
export const CREATECLIENT = "/Clients/addClient";
export const CLIENTLIST="/Clients/getclientslist";
export const CLIENTDETAIL = "/Clients/getclientbyid";
export const CLIENTUPDATE = "/Clients/updateclient";
export const DELETECLIENT = "/Clients/deleteclient";
export const CLIENTDROPDOWN = "/Clients/getclients";

export const SENDERNAMELIST = "/SenderNames/getsenderNameslist";
export const CREATESENDERNAME = "/SenderNames/addSenderName";
export const SENDERNAMEDETAIL = "/SenderNames/getsenderNamebyid";
export const UPDATESENDERNAME = "/SenderNames/updatesenderName";
export const DELETESENDERNAME = "/SenderNames/deletesenderName";
export const SENDERNAMEDROP = "/SenderNames/getsendernames"

export const CONTACTLIST="/Contacts/getcontactslist"; 
export const CONTACTDETAILS="/Contacts/getcontactbyid"; 
export const CREATECONTACT="/Contacts/addContact";
export const DELETECONTACT="/Contacts/deletecontact"; 
export const UPDATECONTACT="/Contacts/updatecontact";
export const BULKUPLOAD = "/Contacts/importcontacts"

export const GROUPLIST = "/Groups/getgroupslist";
export const CREATEGROUP = "/Groups/addGroup" ;
export const GROUPDETAILS = "/Groups/getgroupbyid";
export const UPDATEGROUP = "/Groups/updategroup";
export const DELETEGROUP = "/Groups/deletegroup";
export const GROUPDROPDOWN = "/Groups/getgroups"

export const TEMPLATELIST = "/Templates/gettemplateslist";
export const INRERACTIVETEMPLATELIST = "/InteractiveTemplates/getinteractivetemplateslist"
export const TEMPLATEDETAILS = "/Templates/gettemplatedetails";
export const INTERACTIVETEMPLATEDETAILS = "/InteractiveTemplates/getinteractivetemplatedetail";
export const CREATETEMPLATE = "/Templates/addTemplate";
export const CREATEINTERACTIVETEMPLATE = "/InteractiveTemplates/addinteractivetemplate";
export const SYNCTEMPLATE = "/Templates/templatesync";
export const UPDATETEMPLATE = "/Templates/updatetemplate";
export const UPDATEINTERACTIVETEMPLATE = "/InteractiveTemplates/updateinteractivetemplate";
export const DELETETEMPLATE = "/Templates/deletetemplate";
export const TEMPLATEDROPDOWN = "/Templates/gettemplates"

export const ROLELIST = "/Role/getRolelist";
export const ROLEDETAILS = "/Role/getRolebyid";
export const CREATEROLES = "/Role/addRole";
export const UPDATEROLES = "/Role/updateRole";
export const DELETEROLES = "/Role/deleteRole";
export const ROLEDROP = "/Role/getroles"

export const CREATECAMPAIGN = "/Campaigns/addcampaign";
export const CAMPAIGNLIST = "/Campaigns/getcampaignlist";
export const ACTIVATECAMPAIGN = "/Campaigns/activatecampaign";
export const UPDATECAMPAIGN = "/Campaigns/updatecampaign";
export const CAMPAIGNDETAIL = "/Campaigns/getcampaigndetail";
export const CAMPAIGNCONTACTFREQUENTSTATE="/Campaigns/getcampaigncontactstats";
export const CAMPAIGNCONTACTFREQUENTREMOVE="/Campaigns/deletefrequentlycontactedcontacts";
export const SENDCAMPAIGN="/Campaigns/sendcampaign";


export const UPLOADMEDIA = "/Media/uploadmedia"
export const MEDIALIST = "/Media/getmedialist"
export const DELETEMEDIA = "/Media/deletemedia"

export const PERMISSIONLIST = "/Permissions/getpermissionlist"
export const CREATEPERMISSION = "/Permissions/addpermission"

export const USERLIST = "/User/getuserslist"
export const USERDETAILS = "/User/getuserbyid"
export const CREATEUSER = "/User/adduser"
export const UPDATEUSER = "/User/updateuser"
export const DELETEUSER = "/User/deleteuser"

// Report end points
export const MESSAGESUMMARY = "/ApiMessage/getapimessagelist"
export const MESSAGEREPORT = "/MessageSentLog/getmessagesentloglist"
export const ACTIVECONVOLIST = "#"
export const AGENTSSTATUSLIST = "#"
export const TEMPLATEINSIGHT = "/Dashboard/gettemplateinsight"


export const AGENTLIST = "/Agents/getagentlist"
export const AGENTDETAILS = "/Agents/getagentbyid"
export const CREATEAGENT = "/Agents/addagent"
export const AGENTSTIMINGLIST = "/Agents/getagenttiminglist"
export const ADDAGENTSTIMING = "/Agents/addagenttimings"
export const UPDATEAGENT = "/Agents/updateagent"
export const DELETEAGENT = "/Agents/deleteagent"
export const AGENTDROPDOWN = "/Agents/getagents"
export const GETAGENTSTATS = "/Agents/GetAgentStats"

//convesration Endpoints
export const CONVERSATIONLIST = "/Conversation/getagentconversationlist";
export const CONVERSATIONMESSAGE = "/Conversation/getconversationmessagebyid";
export const AGENTMESSAGE = "/Message/sendagentmessage";

//MasterSlice Endpoints
export const TEMPLATECATEGORY = "/Templates/gettemplatecategories";
export const TEMPLATELANGUAGE = "/Templates/getlanguages";

export const CHATSMONITOR ="/Conversation/getconversationreportlist"
export const AGENTSMONITOR ="/Agents/getagentsupervisorreport"

//interactive templates
export const AGENTINTERACTIVETEMPLATLIST =  "/InteractiveTemplates/getagentinteractivetemplates";
export const AGENTINTERACTIVETEMPLATLISTDETAIL = "/InteractiveTemplates/getinteractivetemplatedetail";
export const SENDAGENTINTERACTIVETEMPLATLIS = "/Message/sendagentinteractivemessage";


