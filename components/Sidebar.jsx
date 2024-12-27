import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { sidebarItems } from '@/utils/sidebarItems';

const Sidebar = ({ isSidebarOpen }) => {
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
    <aside
      className={`  text-white dark:bg-gray-900 fixed left-0 top-16 z-40 h-screen transition-all transform ${
        isSidebarOpen ? 'translate-x-0 w-64' : 'translate-x-0 w-20'
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {sidebarItems.map((menu) => {
            const showSubMenu = menu.submenu.some((sm) => checkPermissions(permissions, sm.text, 'canView'));

            if (showSubMenu && menu.submenu.length > 0) {
              return (
                <li key={menu.text}>
                  <button
                    type="button"
                    className={`flex items-center w-full p-2 font-semibold text-md text-gray-200 rounded-lg hover:bg-gray-700 focus:outline-none ${
                      isExpand[menu.text] ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => handleClickMultiLevelMenu(menu.text)}
                  >
                    <i className={`mr-2 ${menu.icon || ''} ${isSidebarOpen ? '' : 'text-lg'}`}></i>
                    {isSidebarOpen && <span className="flex-1 text-left text-md">{menu.text}</span>}
                    {isSidebarOpen && (
                      <svg className="w-3 h-3 ml-2" fill="none" viewBox="0 0 10 6">
                        <path d="M1 1l4 4 4-4" stroke="currentColor"></path>
                      </svg>
                    )}
                  </button>
                  {isSidebarOpen && (
                    <ul className={`pl-4 ${isExpand[menu.text] ? '' : 'hidden'}`}>
                      {menu.submenu.map(
                        (sm) =>
                          checkPermissions(permissions, sm.text, 'canView') && (
                            <li key={sm.text}>
                              <Link
                                href={sm.href}
                                className="block p-2 text-gray-200 hover:bg-gray-700  items-center text-md text-decoration-none"
                              >
                                <i className={`mr-2 ${sm.icon || ''}`}></i>
                                <span className='text-md font-semibold text-decoration-none'>
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
                <li key={menu.text}>
                  <Link
                    href={menu.href}
                    className="flex items-center p-2 font-semibold text-gray-100 rounded-lg hover:bg-gray-700 text-decoration-none text-md"
                  >
                    <i className={`mr-2 ${menu.icon || ''} ${isSidebarOpen ? '' : 'text-xl'}`}></i>
                    {isSidebarOpen && <span>{menu.text}</span>}
                  </Link>
                </li>
              );
            }

            return null;
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
