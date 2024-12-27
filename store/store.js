import authSlice from "@/slices/AuthSlice";
import testSlice from "@/slices/test.slice";
import ContactSlice from "@/slices/ContactSlice";
import clientSlice from "@/slices/ClientSlice";
import sendernameSlice from "@/slices/sendernameSlice";
import GroupSlice from "@/slices/Groupslice";
import templateSlice from "@/slices/TemplateSlice";
import CampaignSlice from "@/slices/campaignSlice"
import mediaSlice from "@/slices/MediaSlice";
import roleSlice from "@/slices/RoleSlice";
import userSlice from "@/slices/UserSlice";
import permissionSlice from "@/slices/PermissionSlice";
import reportSlice from "@/slices/ReportSlice";
import agentSlice from "@/slices/AgentSlice";
import conversationSlice from "@/slices/ConversationSlice";
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

    }
})