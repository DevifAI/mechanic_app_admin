import { useCallback} from "react";
import { Link, useLocation } from "react-router";
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
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <MdDashboard size={20} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <MdWork size={20} />,
    name: "Projects",
    path: "/projects",
  },
  {
    icon: <MdPeople size={20} />,
    name: "Employees",
    path: "/employees",
  },
  {
    icon: <MdBusiness size={20} />,
    name: "Partners",
    path: "/partners",
  },
  {
    icon: <MdBuild size={20} />,
    name: "Equipments",
    path: "/equipments",
  },
  {
    icon: <MdAttachMoney size={20} />,
    name: "Revenues",
    path: "/revenues",
  },
  {
    icon: <MdLocationOn size={20} />,
    name: "Store Locations",
    path: "/store-locations",
  },
  {
    icon: <MdInventory size={20} />,
    name: "Consumables",
    path: "/consumables",
  },
  {
    icon: <MdAccessTime size={20} />,
    name: "Shifts",
    path: "/shifts",
  },
  {
    icon: <MdSecurity size={20} />,
    name: "Roles",
    path: "/roles",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
      <Link to="/">
  {isExpanded || isHovered || isMobileOpen ? (
    <span className="text-xl font-semibold dark:text-white">
      Welcome Super Admin ,
    </span>
  ) : (
    <span className="text-lg font-medium dark:text-white">
      Super Admin
    </span>
  )}
</Link>

      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                Menu
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav) => (
                  <li key={nav.name}>
                    <Link
                      to={nav.path}
                      className={`menu-item group ${
                        isActive(nav.path)
                          ? "menu-item-active"
                          : "menu-item-inactive"
                      }`}
                    >
                      <span
                        className={`menu-item-icon-size ${
                          isActive(nav.path)
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                        }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
       
      </div>
    </aside>
  );
};

export default AppSidebar;
