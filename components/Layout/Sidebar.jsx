import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { sidebarItems } from '@/utils/sidebarItems';
import { useRouter } from 'next/router';

const Sidebar = ({ isSidebarOpen }) => {
  const router = useRouter();
  const [isExpand, setIsExpand] = useState({});
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permission') || '[]');
    setPermissions(storedPermissions);
  }, []);

  const checkPermissions = (permissions, taskName, actionType) => {
    return permissions.some((perm) => perm.permissionTaskName === taskName && perm[actionType]);
  };

  const handleClickMultiLevelMenu = (menuName) => {
    setIsExpand((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  return (
    <nav className="h-full flex flex-col">
      <div className="flex-1 px-2 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((menu) => {
            const showSubMenu = menu.submenu.some((sm) =>
              checkPermissions(permissions, sm.text, 'canView')
            );

            if (showSubMenu && menu.submenu.length > 0) {
              return (
                <li key={menu.text} className="mb-1">
                  <button
                    type="button"
                    className={`flex items-center w-full p-2 text-base rounded-lg transition-all duration-200 ${
                      isExpand[menu.text] 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-900 hover:bg-white hover:shadow-sm'
                    }`}
                    onClick={() => handleClickMultiLevelMenu(menu.text)}
                  >
                    <span className="mr-3 flex items-center justify-center w-5 h-5 flex-shrink-0">
                      {menu.icon}
                    </span>
                    {isSidebarOpen && (
                      <span className="flex-1 text-left whitespace-nowrap sidebar-text truncate">
                        {menu.text}
                      </span>
                    )}
                    {isSidebarOpen && (
                      <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" viewBox="0 0 10 6">
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          d="M1 1l4 4 4-4"
                        ></path>
                      </svg>
                    )}
                  </button>
                  {isSidebarOpen && (
                    <ul
                      className={`pl-3 mt-1 space-y-1 ${isExpand[menu.text] ? '' : 'hidden'}`}
                    >
                      {menu.submenu.map(
                        (sm) =>
                          checkPermissions(permissions, sm.text, 'canView') && (
                            <li key={sm.text}>
                              <Link
                                href={sm.href}
                                className={`flex items-center p-2 rounded-lg transition-all duration-200 sidebar-link ${
                                  router.pathname === sm.href
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-900 hover:bg-white hover:shadow-sm'
                                }`}
                              >
                                <span className="mr-3 flex items-center justify-center w-5 h-5 flex-shrink-0">
                                  {sm.icon}
                                </span>
                                <span className="whitespace-nowrap sidebar-text truncate">
                                  {sm.text}
                                </span>
                              </Link>
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </li>
              );
            }

            if (checkPermissions(permissions, menu.text, 'canView')) {
              return (
                <li key={menu.text} className="mb-1">
                  <Link
                    href={menu.href}
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 sidebar-link ${
                      router.pathname === menu.href
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-900 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-3 flex items-center justify-center w-5 h-5 flex-shrink-0">
                      {menu.icon}
                    </span>
                    {isSidebarOpen && (
                      <span className="whitespace-nowrap sidebar-text truncate">
                        {menu.text}
                      </span>
                    )}
                  </Link>
                </li>
              );
            }

            return null;
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
