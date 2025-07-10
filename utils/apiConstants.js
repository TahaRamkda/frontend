export const BASE_URL = "https://qawhatsappapi.consulttechies.com";
export const LOGINAPI = "/User/Login";
export const REFRESHTOKENAPI = "/Token/Refresh";
export const DASHBOARDSUMMARY = "/Dashboard/getdashboardsummary";
export const SUPERVISORDASHBOARD = "/Supervisor/getsupervisordashboard";
export const DASHBOARDREPORT="/Dashboard/getdashboardreportsummary";
// Clients endpoints
export const CREATECLIENT = "/Clients/addClient";
export const CLIENTLIST="/Clients/getclientslist";
export const CLIENTDETAIL = "/Clients/getclientbyid";
export const CLIENTUPDATE = "/Clients/updateclient";
export const DELETECLIENT = "/Clients/deleteclient";
export const CLIENTDROPDOWN = "/Clients/getclients";
//sendername endpoints
export const SENDERNAMELIST = "/SenderNames/getsenderNameslist";
export const CREATESENDERNAME = "/SenderNames/addSenderName";
export const SENDERNAMEDETAIL = "/SenderNames/getsenderNamebyid";
export const UPDATESENDERNAME = "/SenderNames/updatesenderName";
export const DELETESENDERNAME = "/SenderNames/deletesenderName";
export const SENDERNAMEDROP = "/SenderNames/getsendernames";
//Contact endpoints
export const CONTACTLIST="/Contacts/getcontactslist"; 
export const CONTACTDETAILS="/Contacts/getcontactbyid"; 
export const CREATECONTACT="/Contacts/addContact";
export const DELETECONTACT="/Contacts/deletecontact"; 
export const UPDATECONTACT="/Contacts/updatecontact";
export const BULKUPLOAD = "/Contacts/importcontacts";
//Group endpoints
export const GROUPLIST = "/Groups/getgroupslist";
export const CREATEGROUP = "/Groups/addGroup" ;
export const GROUPDETAILS = "/Groups/getgroupbyid";
export const UPDATEGROUP = "/Groups/updategroup";
export const DELETEGROUP = "/Groups/deletegroup";
export const GROUPDROPDOWN = "/Groups/getgroups";
//Template endpoints
export const TEMPLATELIST = "/Templates/gettemplateslist";
export const TEMPLATEDETAILS = "/Templates/gettemplatedetails";
export const CREATETEMPLATE = "/Templates/addTemplate";
export const SYNCTEMPLATE = "/Templates/templatesync";
export const UPDATETEMPLATE = "/Templates/updatetemplate";
export const DELETETEMPLATE = "/Templates/deletetemplate";
export const TEMPLATEDROPDOWN = "/Templates/gettemplates";


// interractive Templates
export const INRERACTIVETEMPLATELIST = "/InteractiveTemplates/getinteractivetemplateslist";
export const INTERACTIVETEMPLATEDETAILS = "/InteractiveTemplates/getinteractivetemplatedetail";
export const CREATEINTERACTIVETEMPLATE = "/InteractiveTemplates/addinteractivetemplate";
export const UPDATEINTERACTIVETEMPLATE = "/InteractiveTemplates/updateinteractivetemplate";
export const INTERACTIVETEMPLATEDROPWITHOUTPARAM = "/InteractiveTemplates/getinteractivetemplatewithoutparams";
export const INTERACTIVETEMPLATEDROPDOWN = "/InteractiveTemplates/getagentinteractivetemplates";

//Role endpoints
export const ROLELIST = "/Role/getRolelist";
export const ROLEDETAILS = "/Role/getRolebyid";
export const CREATEROLES = "/Role/addRole";
export const UPDATEROLES = "/Role/updateRole";
export const DELETEROLES = "/Role/deleteRole";
export const ROLEDROP = "/Role/getroles";

//Campaign endpoints
export const CREATECAMPAIGN = "/Campaigns/addcampaign";
export const CAMPAIGNLIST = "/Campaigns/getcampaignlist";
export const ACTIVATECAMPAIGN = "/Campaigns/activatecampaign";
export const UPDATECAMPAIGN = "/Campaigns/updatecampaign";
export const CAMPAIGNDETAIL = "/Campaigns/getcampaigndetail";
export const CAMPAIGNCONTACTFREQUENTSTATE="/Campaigns/getcampaigncontactstats";
export const CAMPAIGNCONTACTFREQUENTREMOVE="/Campaigns/deletefrequentlycontactedcontacts";
export const SENDCAMPAIGN="/Campaigns/sendcampaign";

//Media endpoints
export const UPLOADMEDIA = "/Media/uploadmedia";
export const MEDIALIST = "/Media/getmedialist";
export const DELETEMEDIA = "/Media/deletemedia";

//Permission endpoints
export const PERMISSIONLIST = "/Permissions/getpermissionlist";
export const CREATEPERMISSION = "/Permissions/addpermission";

//user endpoints
export const USERLIST = "/User/getuserslist";
export const USERDETAILS = "/User/getuserbyid";
export const CREATEUSER = "/User/adduser";
export const UPDATEUSER = "/User/updateuser";
export const CHANGEPASSWORD = "/User/changepassword";
export const DELETEUSER = "/User/deleteuser";

// Report end points
export const MESSAGESUMMARY = "/ApiMessage/getapimessagelist";
export const MESSAGEREPORT = "/MessageSentLog/getmessagesentloglist";
export const TEMPLATEINSIGHT = "/Dashboard/gettemplateinsight";
export const CHATSMONITOR ="/Conversation/getconversationreportlist";
export const CHATREPORTSTATS = "/Conversation/getconversationstatistics";
export const CHATREPORTLOGS = "/Conversation/getconversationlogslist";
export const AGENTSMONITOR ="/Agents/getagentsupervisorreport";
export const AGENTREPORT = "/Agents/getagentdetailsupervisorreport";
export const TEMPLATEANALYTICS = "/TemplateAnalytics/GetTemplateList"; 
export const TEMPLATEANALYTICSDETAILS = "/TemplateAnalytics/GetTemplateAnalyticDetails"
//agenst endpoints
export const AGENTLIST = "/Agents/getagentlist";
export const AGENTDETAILS = "/Agents/getagentbyid";
export const CREATEAGENT = "/Agents/addagent";
export const AGENTSTIMINGLIST = "/Agents/getagenttiminglist";
export const ADDAGENTSTIMING = "/Agents/addagenttimings";
export const UPDATEAGENT = "/Agents/updateagent";
export const DELETEAGENT = "/Agents/deleteagent";
export const AGENTDROPDOWN = "/Agents/getagents";
export const GETAGENTSTATS = "/Agents/GetAgentStats";
export const ACTIVEAGENTS = "/Agents/getactiveagents";
export const AGENTSHIFTBULKUPLOAD = "/Agents/importbulkagenttimings";
export const MASTERDATA = "/MasterData/getmasterdatalist";
export const AGENTSTATUS = "/Agents/setagentstatus";


// Agents Shift
export const AGENTSSHIFT = "#";
export const CREATEAGENTSHIFT = "#";
export const AGENTSHIFTDETAILS = "#";
export const UPDATEAGENTSHIFT = "#";
export const DELETEAGENTSHIFT = "#";

// Agents Perfomance
export const AGENTPERFORMANCE = "#";
//convesration <Endpoints></Endpoints>
export const CONVERSATIONLIST = "/Conversation/getagentconversationlist";
export const CONVERSATIONMESSAGE = "/Conversation/getconversationmessagebyid";
export const AGENTMESSAGE = "/Message/sendagentmessage";
export const TRANSFERCHAT = "/Conversation/transferconversationtoagent";
export const AGENTDISABLE = "/Agents/setagentdisable";
export const CONVERSATIONREPORT ="/Conversation/getconversationdetailreportlist";

//MasterSlice Endpoints
export const TEMPLATECATEGORY = "/Templates/gettemplatecategories";
export const TEMPLATELANGUAGE = "/Templates/getlanguages";



//Agent interactive templates
export const AGENTINTERACTIVETEMPLATLIST =  "/InteractiveTemplates/getagentinteractivetemplates";
export const AGENTINTERACTIVETEMPLATLISTDETAIL = "/InteractiveTemplates/getinteractivetemplatedetail";
export const SENDAGENTINTERACTIVETEMPLATLIS = "/Message/sendagentinteractivemessage";

// Export Excel Endpoints
export const EXCELEXPORTCHATREPORT = "/Conversation/getexportconversationdetailreportlist";
export const EXCELEXPORTCHATMONITOR = "/Conversation/exportconversationreportlist";
export const EXCELEXPORTAGENTMONITOR = "/Agents/exportagentsupervisorreport";
export const EXCELEXPORTAGENTREPORT = "/Agents/getexportagentdetailsupervisorreport";
export const EXCELEXPORTSURVEYREPORT = "/Flows/exportsurveyresponse";
export const EXCELEXPORTTEMPLATEANALYTICS = "/TemplateAnalytics/ExportTemplateAnalyticsDetailsReport";

// close chat template By supervisor
export const SENDCLOSECHATTEMPLATE = "/Conversation/closechatbysupervisor";

// flows
export const FLOWSLIST = "/Flows/getflowslist";
export const CREATEFLOW = "/Flows/addflow";
export const FLOWDETAILS = "/Flows/getflowdetailsbyid";
export const UPDATEFLOW = "/Flows/updateflow";
export const PUBLISHFLOW = "/Flows/publishflow";
export const DELETEFLOW = "/Flows/deleteflow";
export const FLOWDROPDOWN = "/Flows/getflows";

// Survey Report 
export const SURVEYDROPDOWN = "/SurveyReport/getsurveys";

// Flow Visualization 
export const TEMPLATEVISUALIZATION = "/Templates/GetTemplateVisualization";

// App Setting
export const SETTINGLIST = "/AppSettings/getappsettinglist";
export const SETTINGBYID ="/AppSettings/getappsettingbyid";
export const ADDSETTINGS = "/AppSettings/addAppsettings";
export const UPDATEAPPSETTING = "/AppSettings/updateappsettings";
export const DELETEAPPSETTING ="/AppSettings/deleteappsetting";
export const APPSETTING = "/AppSettings/getappsettings";

// Clear Cache
export const CLEARAPICACHE = "/Cache/Clear";
export const CLEARBRIDGECACHE = "/Cache/ClearBridgeCache"

// Order Endpoints
export const ORDERLIST = "#";
export const ORDERDETAILS = "#";
export const UPDATEORDER = "#";
export const DELETEORDER = "#";
// Order Report
export const ORDERREPORTLIST = "#";
export const ORDERREPORTDETAILS = "#";
export const UPDATEORDERREPORT = "#";
export const DELETEORDERREPORT = "#";
// Menu Endpoints
export const MENULIST = "#";
export const MENUDETAILS = "#";
export const UPDATEMENU = "#";
export const DELETEMENU = "#";

// Wallet Endpoints
export const WALLETBALANCE = "/Wallet/checkBalance";

// White Labelling
export const MERCHANTDETAILS = "/MerchantSettingInfo/getMerchantDetails"