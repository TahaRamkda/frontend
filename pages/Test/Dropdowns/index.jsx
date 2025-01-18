import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import TemplatesDropdown from '@/components/MultiSelect/TemplateDropdown';
import ClientDropdown from '@/components/Dropdowns/ClientDropdown';
import ClientsDropdown from '@/components/MultiSelect/ClientDropdown';
import AgentDropdown from '@/components/Dropdowns/AgentDropdown';
import AgentsDropdown from '@/components/MultiSelect/AgentDropdown';
import GroupDropdown from '@/components/Dropdowns/GroupDropdown';
import GroupsDropdown from '@/components/MultiSelect/GroupDropdown';
import TemplateCategoryDropdown from '@/components/Dropdowns/TemplateCategorydropdown';
import LanguageDropdown from '@/components/Dropdowns/LanguageDropdown';
import RolesDropdown from '@/components/MultiSelect/RoleDropdown';
import App from "@/components/Layout/App";
import { useRouter } from 'next/router';  // Correct import
import ActiveAgentDropdown from '@/components/Dropdowns/ActiveAgentsDropdown';


const DropDowns = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [Id, setId] = useState(0);
  const [Id1, setId1] = useState(0);


  const handleChange = (e) => {
    const Id = e.target.value;
    setId(Id)
  };
  const handleChange1 = (e) => {
    const Id1 = e.target.value;
    setId1(Id1)
  };
  return (
    <App>
      <div className="flex items-center">
        <label htmlFor="">Template</label>
        <TemplateDropdown onChange={handleChange} />
      </div><br />
      <div className="flex items-center">
        <label htmlFor="">MultiTemplate</label>
        <TemplatesDropdown />
      </div><br />
      <div className="flex items-center">
        <label htmlFor="">Clients</label>
        <ClientDropdown onChange={handleChange1} />
      </div><br />
      <div className="flex items-center">
        <label htmlFor="">MultiClients</label>
        <ClientsDropdown />
      </div><br />
      <div className="flex items-center">
        <label htmlFor="">Agent</label>
        <AgentDropdown onChange={handleChange1} />
      </div><br />
      <div className="flex items-center">
        <label htmlFor="">MultiAgents</label>
        <AgentsDropdown />
      </div><br />

      <div className="flex items-center">
        <label htmlFor="">Group</label>
        <GroupDropdown onChange={handleChange1} />
      </div><br />

      <div className="flex items-center">
        <label htmlFor="">MultiGroup</label>
        <GroupsDropdown />
      </div>

      <div className="flex items-center">
        <label htmlFor="">Template</label>
        <TemplateCategoryDropdown onChange={handleChange1} />
      </div><br />

      <div className="flex items-center">
        <label htmlFor="">Language</label>
        <LanguageDropdown onChange={handleChange1} />
      </div><br />

      <div className="flex items-center">
        <label htmlFor="">Roles</label>
        <RolesDropdown  />
      </div><br />

      <div className="flex items-center">
        <label htmlFor="">Active agents</label>
        <ActiveAgentDropdown onChange={handleChange1} SenderId={1}/>
      </div><br />


    </App>
  );
};

export default DropDowns;
