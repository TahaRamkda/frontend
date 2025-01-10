export const sidebarItems = [
    {
      href: '/Dashboard',
      icon: 'ti-dashboard', // Dashboard icon
      text: 'Dashboard',
      module: 1,
      submenu: [],
    },
    {
      href: '/Campaigns/CampaignsList',
      icon: 'ti-announcement', // Bullhorn icon for Campaigns
      text: 'Campaigns',
      module: 1,
      submenu: [],
    },
    {
      href: '/Groups/GroupList',
      icon: 'ti-layers', // Layers icon for Groups
      text: 'Groups',
      module: 1,
      submenu: [],
    },
    {
      href: '/Contacts/ContactList',
      icon: 'ti-book', // Address book icon for Contacts
      text: 'Contacts',
      module: 1,
      submenu: [],
    },
    {
      href: '/Agents/AgentsList',
      icon: 'ti-user', // User icon for Clients
      text: 'Agents',
      module: 1,
      submenu: [],
    },
    {
      href: '/Templates/TemplatesList',
      icon: 'ti-layout', // Layout icon for Templates
      text: 'Templates',
      module: 1,
      submenu: [],
    },

    {
      href: '/InteractiveTemplates/InteractiveList',
      icon: 'ti-layout', // Layout icon for Templates
      text: 'Interactive Templates',
      module: 1,
      submenu: [],
    },
    {
      href: '/TemplateInsight',
      icon: 'ti-bar-chart-alt', // Bar chart icon for Template Insight
      text: 'Template Insight',
      module: 1,
      submenu: [],
    },
    {
      href: '/Clients/ClientsList',
      icon: 'ti-user', // User icon for Clients
      text: 'Clients',
      module: 1,
      submenu: [],
    },
    {
      href: '/Chats/ChatsList',
      icon: 'ti-comments', // Chat bubble icon for Chats
      text: 'Chats',
      module: 1,
      submenu: [],
    },
    {
      href: '/SenderNames/SenderNamelist',
      icon: 'ti-id-badge', // ID badge icon for Sender Names
      text: 'Sender Names',
      module: 1,
      submenu: [],
    },
    
    {
      href: '/SenderNamesAdmin/SenderNamelist',
      icon: 'ti-id-badge', // ID badge icon for Sender Names
      text: 'Sender Names Admin',
      module: 1,
      submenu: [],
    },
    {
      href: '/Media/MediaList',
      icon: 'ti-cloud-up', // Cloud upload icon for Media Upload
      text: 'Media',
      module: 1,
      submenu: [],
    },
   
    {
      href: '#',
      icon: 'ti-bar-chart', // Chart icon for Reports
      text: 'Reports',
      module: 2,
      submenu: [
        {
          href: '/Reports/MessagesReports',
          text: 'Message Reports',
          icon: 'ti-clipboard', // Clipboard icon for Message Reports
        },
        {
          href: '/Reports/MessageSummary',
          text: 'Message Summary',
          icon: 'ti-pie-chart', // Pie chart icon for Message Summary
        },
      ],
    },
    {
      href: '#',
      icon: 'ti-user', // Chart icon for Reports
      text: 'Supervisor',
      module: 2,
      submenu: [
        {
          href: '/Supervisor/ChatsMonitor',
          text: 'Chats Monitor',
          icon: 'ti-clipboard', // Clipboard icon for Message Reports
        },
        {
          href: '/Supervisor/AgentsMonitor',
          text: 'Agents Monitor',
          icon: 'ti-clipboard', // Pie chart icon for Message Summary
        },
      ],
    },
    {
      href: '/Roles/RolesList',
      icon: 'ti-settings', // Settings icon for Roles
      text: 'Roles',
      module: 1,
      submenu: [],
    },
    {
      href: '/Users/UsersList',
      icon: 'ti-user', // Settings icon for Roles
      text: 'Users',
      module: 1,
      submenu: [],
    },

    {
      href: '/Permissions/PermissionList',
      icon: 'ti-lock', // Lock icon for Permissions
      text: 'Permissions',
      module: 1,
      submenu: [],
    },
    {
      href: '/dashboard',
      icon: 'ti-power-off', // Power-off icon for Logout
      text: 'Logout',
      module: 3,
      submenu: [],
    },
  ];
  
