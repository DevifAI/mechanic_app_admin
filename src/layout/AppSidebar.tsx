import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "react-icons/md";
import { AiFillPlusCircle } from "react-icons/ai";
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
      { name: "View Equipments", path: "/equipments/view", icon: null },
    ],
  },
  {
    icon: <MdAttachMoney size={20} />,
    name: "Revenues",
    path: "/revenues",
    subItems: [
      { name: "Add Revenue", path: "/revenues/create", icon: null },
      { name: "View Revenues", path: "/revenues/view", icon: null },
    ],
  },
  {
    icon: <MdLocationOn size={20} />,
    name: "Store Locations",
    path: "/store-locations",
    subItems: [
      { name: "Add Store", path: "/store-locations/create", icon: null },
      { name: "View Stores", path: "/store-locations/view", icon: null },
    ],
  },
  {
    icon: <MdInventory size={20} />,
    name: "Consumables",
    path: "/consumables",
    subItems: [
      { name: "Add Consumable", path: "/consumable/create", icon: null },
      { name: "View Consumables", path: "/consumables/view", icon: null },
    ],
  },
  {
    icon: <MdAccessTime size={20} />,
    name: "Shifts",
    path: "/shifts",
    subItems: [
      { name: "Create Shift", path: "/shifts/create", icon: null },
      { name: "View Shifts", path: "/shifts/view", icon: null },
    ],
  },
  {
    icon: <MdSecurity size={20} />,
    name: "Roles",
    path: "/roles",
    subItems: [
      { name: "Create Role", path: "/roles/create", icon: null },
      { name: "View Roles", path: "/roles/view", icon: null },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } =
    useSidebar();
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


  const shouldShowText = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-gray-800 text-white dark:bg-gray-800 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 dark:border-gray-700
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
            <p className="text-sm font-medium text-white">Super Admin</p>
            <p className="text-xs text-white">Admin</p>
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

              // Find "Create"/"Add" and "View" subItems if they exist
              const createSub = nav.subItems?.find(
                (sub) =>
                  sub.name.toLowerCase().includes("create") ||
                  sub.name.toLowerCase().includes("add")
              );
              const viewSub = nav.subItems?.find((sub) =>
                sub.name.toLowerCase().includes("view")
              );

              return (
                <li key={nav.name}>
                  <div
                    onClick={() => {
                      if (hasSub && viewSub) {
                        navigate(viewSub.path);
                      } else if (hasSub) {
                        toggleMenu(nav.name);
                      } else {
                        navigate(nav.path);
                      }
                    }}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${
                      isParentActive(nav, location.pathname)
                        ? "bg-blue-500 text-white"
                        : "text-white hover:bg-gray-600"
                    }
                      ${
                        !shouldShowText ? "justify-center" : "justify-between"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="text-white">
                        {nav.icon}
                      </span>
                      {shouldShowText && (
                        <span className="ml-3">{nav.name}</span>
                      )}
                    </div>
                    {shouldShowText && hasSub && createSub && (
                      <AiFillPlusCircle 
                        className={`transform text-white transition-transform duration-200 ${
                          isOpen ? "rotate-90" : ""
                        } cursor-pointer`}
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(createSub.path);
                        }}
                        title={createSub.name}
                      />
                    )}
                  </div>

                  {/* Dropdown (optional, can be enabled if you want submenus visible)
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
                  */}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {shouldShowText ? "Collapse Sidebar" : ""}
          </span>
          <button
            onClick={() => {
              toggleSidebar();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <svg
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M7.5 15l5-5-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;