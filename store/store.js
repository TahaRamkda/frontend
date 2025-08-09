import authSlice from "@/slices/AuthSlice";
import testSlice from "@/slices/test.slice";
import ContactSlice from "@/slices/ContactSlice";
import clientSlice from "@/slices/clientSlice";
import sendernameSlice from "@/slices/sendernameSlice";
import GroupSlice from "@/slices/Groupslice";
import templateSlice from "@/slices/TemplateSlice";
import interactiveTemplateSlice from "@/slices/InteractiveTemplateSlice";
import CampaignSlice from "@/slices/campaignSlice";
import mediaSlice from "@/slices/MediaSlice";
import roleSlice from "@/slices/RoleSlice";
import userSlice from "@/slices/UserSlice";
import permissionSlice from "@/slices/PermissionSlice";
import reportSlice from "@/slices/ReportSlice";
import agentSlice from "@/slices/AgentSlice";
import conversationSlice from "@/slices/ConversationSlice";
import SuperwiserSlice from "@/slices/SuperwiseSlice";
import agentTemplateSlice from "@/slices/AgentTemplateSlice";
import agentShiftSlice from "@/slices/AgentsShift";
import chatTestSlice from "@/slices/ChatTest";
import ChatBridgeSlice from "@/slices/ChatBridgeSlice";
import ClearCache from "@/slices/CacheSlice";
import FlowSlice from "@/slices/FlowsSlice";
import TemplateVisualizationSlice  from "@/slices/TemplateVisualizationSlice";
import  AppSettingSlice  from "@/slices/AppSettingSlice";
import orderSlice from "@/slices/OrderSlice";
import menuSlice from "@/slices/MenuSlice";
import dropdownSlice from "@/slices/DropdownSlice";
import walletSlice from "@/slices/WalletSlice";
import merchantSlice from "@/slices/MerchantSlice";
import conversationAnalyticsSlice from "@/slices/ConversationAnalyticsSlice"
import enquirySlice from "@/slices/EnquirySlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{
    testData: testSlice,
    authData:authSlice,
    clients:clientSlice,
    sendernames:sendernameSlice,
    groups:GroupSlice,
    contacts:ContactSlice,
    templates:templateSlice,
    campaigns:CampaignSlice,
    media:mediaSlice,
    permission:permissionSlice,
    roles:roleSlice,
    users:userSlice,
    reports:reportSlice,
    agents:agentSlice,
    conversations:conversationSlice,
    Supervisor:SuperwiserSlice,
    agenttemplates:agentTemplateSlice,
    interactiveTemplates:interactiveTemplateSlice,
    agentShifts: agentShiftSlice,
    chatTest: chatTestSlice,
    bridge:ChatBridgeSlice,
    flows:FlowSlice,
    templateVisualization:TemplateVisualizationSlice,
    appsetting:AppSettingSlice,
    clearCache:ClearCache,
    orders:orderSlice,
    menu: menuSlice,
    dropdown:dropdownSlice,
    wallet:walletSlice,
    merchant:merchantSlice,
    conversationAnalytic:conversationAnalyticsSlice,
    enquiry:enquirySlice,
    }
})
