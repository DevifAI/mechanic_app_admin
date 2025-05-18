import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdWork,
  MdPeople,
  MdBusiness,
  MdBuild,
  MdAttachMoney,
  MdLocationOn,
  MdInventory,
  MdAccessTime,
  MdSecurity,
  MdChevronRight,
  MdSettings,
  MdHelpOutline,
} from "react-icons/md";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  subItems?: NavItem[];
};

const navItems: NavItem[] = [
  {
    icon: <MdDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <MdWork size={20} />,
    name: "Projects",
    path: "/projects",
    subItems: [
      { name: "Create Project", path: "/projects/create", icon: null },
      { name: "View Projects", path: "/projects/view", icon: null },
    ],
  },
  {
    icon: <MdPeople size={20} />,
    name: "Employees",
    path: "/employees",
    subItems: [
      { name: "Create Employee", path: "/employees/create", icon: null },
      { name: "View Employees", path: "/employees/view", icon: null },
    ],
  },
  {
    icon: <MdBusiness size={20} />,
    name: "Partners",
    path: "/partners",
    subItems: [
      { name: "Create Partner", path: "/partners/create", icon: null },
      { name: "View Partners", path: "/partners/view", icon: null },
    ],
  },
  {
    icon: <MdBuild size={20} />,
    name: "Equipments",
    path: "/equipments",
    subItems: [
      { name: "Add Equipment", path: "/equipments/create", icon: null },
      // { name: "View Equipments", path: "/equipments/view", icon: null },
    ],
  },
  {
    icon: <MdAttachMoney size={20} />,
    name: "Revenues",
    path: "/revenues",
    subItems: [
      { name: "Add Revenue", path: "/revenues/create", icon: null },
      // { name: "View Revenues", path: "/revenues/view", icon: null },
    ],
  },
  {
    icon: <MdLocationOn size={20} />,
    name: "Store Locations",
    path: "/store-locations",
    subItems: [
      { name: "Add Store", path: "/store-locations/create", icon: null },
      // { name: "View Stores", path: "/store-locations/view", icon: null },
    ],
  },
  {
    icon: <MdInventory size={20} />,
    name: "Consumables",
    path: "/consumables",
    subItems: [
      { name: "Add Consumable", path: "/consumables/create", icon: null },
      // { name: "View Consumables", path: "/consumables/view", icon: null },
    ],
  },
  {
    icon: <MdAccessTime size={20} />,
    name: "Shifts",
    path: "/shifts",
    subItems: [
      { name: "Create Shift", path: "/shifts/create", icon: null },
      // { name: "View Shifts", path: "/shifts/view", icon: null },
    ],
  },
  {
    icon: <MdSecurity size={20} />,
    name: "Roles",
    path: "/roles",
    subItems: [
      { name: "Create Role", path: "/roles/create", icon: null },
      // { name: "View Roles", path: "/roles/view", icon: null },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isParentActive = (nav: NavItem, locationPath: string) => {
    if (nav.path === "/dashboard") {
      if (locationPath === "/" || locationPath === "/dashboard") return true;
    }
    if (locationPath === nav.path) return true;
    if (nav.subItems) {
      return nav.subItems.some((sub) => locationPath === sub.path);
    }
    return false;
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  const isSubItemActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const shouldShowText = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 dark:border-gray-700
      ${isExpanded || isMobileOpen ? "w-64" : isHovered ? "w-64" : "w-20"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile */}
      <div
        className={`py-4 px-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${
          !shouldShowText ? "justify-center" : "justify-start"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          SA
        </div>
        {shouldShowText && (
          <div className="ml-3">
            <p className="text-sm font-medium dark:text-white">Super Admin</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((nav) => {
              const isOpen = openMenu === nav.name;
              const hasSub = !!nav.subItems;

              return (
                <li key={nav.name}>
                  <div
                    onClick={() => {
                      if (hasSub) {
                        toggleMenu(nav.name);
                      } else {
                        navigate(nav.path);
                      }
                    }}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${
                      isParentActive(nav, location.pathname)
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }
                      ${
                        !shouldShowText ? "justify-center" : "justify-between"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        {nav.icon}
                      </span>
                      {shouldShowText && (
                        <span className="ml-3">{nav.name}</span>
                      )}
                    </div>
                    {shouldShowText && hasSub && (
                      <MdChevronRight
                        className={`transform transition-transform duration-200 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                        size={16}
                      />
                    )}
                  </div>

                  {/* Dropdown */}
                  {shouldShowText && hasSub && isOpen && (
                    <ul className="ml-8 mt-1 space-y-1 transition-all duration-200 ease-in-out">
                      {nav.subItems?.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            className={`block px-3 py-2 text-xs rounded-lg transition-colors
                            ${
                              isSubItemActive(subItem.path)
                                ? "text-blue-600 dark:text-blue-300 font-medium"
                                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
          <ul className="space-y-1">
            <li>
              <Link
                to="/settings"
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive("/settings")
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }
                ${!shouldShowText ? "justify-center" : "justify-start"}`}
              >
                <MdSettings
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                {shouldShowText && <span className="ml-3">Settings</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive("/help")
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }
                ${!shouldShowText ? "justify-center" : "justify-start"}`}
              >
                <MdHelpOutline
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                {shouldShowText && <span className="ml-3">Help & Support</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
