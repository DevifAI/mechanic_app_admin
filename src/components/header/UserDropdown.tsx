import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center w-full justify-between px-2 py-1 hover:bg-[#e5e5e5] transition"
      >
        {/* Logo / Image */}
        <div className="h-8 w-auto">
          <img
            src="https://i.ibb.co/nq91LYHx/Whats-App-Image-2025-05-18-at-12-40-48-AM.jpg"
            alt="User"
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Arrow */}
        <svg
          className={`w-4 h-4 ml-2 text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown content */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute left-0 mt-1 w-[160px] rounded-md border border-gray-200 bg-white shadow-md z-50"
      >
        <Link
          to="/signin"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
}
