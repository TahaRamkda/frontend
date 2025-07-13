import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ActiveAgentDropdown from "@/components/Dropdowns/ActiveAgentsDropdown";
import AgentDropdown from "@/components/Dropdowns/AgentDropdown";
import AgentStatusDropdown from "@/components/Dropdowns/AgentStatusDropdown";
import ClientDropdown from "@/components/Dropdowns/ClientDropdown";
import FlowDropdown from "@/components/Dropdowns/FlowsDropdown";
import GroupDropdown from "@/components/Dropdowns/GroupDropdown";
import IntTemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropdown";
import InteractiveTemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropWithoutParam";
import LanguageDropdown from "@/components/Dropdowns/LanguageDropdown";
import RoleDropdown from "@/components/Dropdowns/RoleDropdown";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import SurveyDropdown from "@/components/Dropdowns/SurveyReportDropdown";
import TemplateCategoryDropdown from "@/components/Dropdowns/TemplateCategorydropdown";
import TemplateDropdown from "@/components/Dropdowns/TemplateDropdown";
import AgentsDropdown from "@/components/MultiSelect/AgentDropdown";
import ChatReasonDropdown from "@/components/MultiSelect/ChatReasonDropdown";
import ClientsDropdown from "@/components/MultiSelect/ClientDropdown";
import FlowsDropdown from "@/components/MultiSelect/FlowDropdown";
import GroupDropdowns from "@/components/MultiSelect/GroupDropdown";
import RolesDropdown from "@/components/MultiSelect/RoleDropdown";
import SendernameDropdowns from "@/components/MultiSelect/SendernameDropdown";
import TemplatesDropdown from "@/components/MultiSelect/TemplateDropdown";
import App from "@/components/Layout/App";
const AppSettings = () => {
 
  return (
    <App>
      <div className=" items-center">
        <label htmlFor="">ActiveAgentDropdown</label>
        <ActiveAgentDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">AgentDropdown</label>
        <AgentDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">AgentStatusDropdown</label>
        <AgentStatusDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">ClientDropdown</label>
        <ClientDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">FlowDropdown</label>
        <FlowDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">GroupDropdown</label>
        <GroupDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">IntTemplateDropdown</label>
        <IntTemplateDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">InteractiveTemplateDropdown</label>
        <InteractiveTemplateDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">LanguageDropdown</label>
        <LanguageDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">RoleDropdown</label>
        <RoleDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">SendernameDropdown</label>
        <SendernameDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">TemplateCategoryDropdown</label>
        <TemplateCategoryDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">TemplateDropdown</label>
        <TemplateDropdown SenderId = '1'  />
      </div>
      <div>
        <h1>Multi Select</h1>
      </div>
      <div className=" items-center">
        <label htmlFor="">AgentsDropdown multi</label>
        <AgentsDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">ChatReasonDropdown multi</label>
        <ChatReasonDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">ClientsDropdown multi</label>
        <ClientsDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">FlowsDropdown multi</label>
        <FlowsDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">GroupDropdowns multi</label>
        <GroupDropdowns SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">RolesDropdown multi</label>
        <RolesDropdown SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">SendernameDropdowns multi</label>
        <SendernameDropdowns SenderId = '1'  />
      </div>
      <div className=" items-center">
        <label htmlFor="">TemplatesDropdown multi</label>
        <TemplatesDropdown SenderId = '1'  />
      </div>
    </App>
  );
};

export default AppSettings;
