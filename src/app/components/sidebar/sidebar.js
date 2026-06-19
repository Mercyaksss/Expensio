"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useExpenses } from '../../context/ExpenseContext';
import pfp from "../../../../assets/pfp.jpg";
import "./sidebar.scss";
import { BarChart3, Receipt, Settings, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',         icon: BarChart3, label: 'Dashboard' },
  { href: '/Expenses', icon: Receipt,   label: 'Expenses'  },
  { href: '/Settings', icon: Settings,  label: 'Settings'  },
];

function Sidebar() {
  const pathname = usePathname();
  const { userName, profilePic } = useExpenses(); // live name + picture from context

  const [isOpen, setIsOpen] = useState(false);

  const openSidebar  = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  const firstName = userName?.split(" ")[0] ?? userName;

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <button
        className={`sidebar-tab ${isOpen ? 'open' : ''}`}
        onClick={isOpen ? closeSidebar : openSidebar}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <i
          className={`ti ${isOpen ? 'ti-chevron-left' : 'ti-chevron-right'}`}
          aria-hidden="true"
        />
      </button>

      <section className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>

        <h2 className="sidebar-logo">Expen<span>sio.</span></h2>

        {/* Profile pill — picture + name both update live from context */}
        <div className="sidebar-profile">
          <div className="avatar">
            {profilePic ? (
              // Uploaded picture — base64 string from context
              <Image src={profilePic} fill alt="profile picture" sizes="36px" />
            ) : (
              // Fallback — default placeholder image
              <Image src={pfp} width={36} height={36} alt="profile picture" />
            )}
          </div>
          <div className="profile-info">
            <p className="profile-name">{userName}</p>
            <p className="profile-sub">Personal</p>
          </div>
        </div>

        <p className="nav-label">Menu</p>

        <nav className='sidebar-nav'>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`side-nav-links ${pathname === href ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <Icon size={17} alt={`${label} icon`} color='#fff' />
              <p>{label}</p>
            </Link>
          ))}
        </nav>

        <button className="logout-btn">
          <LogOut size={17} color='#fff'/>
          <p>Log Out</p>
        </button>

      </section>
    </>
  );
}

export default Sidebar;