"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useExpenses } from '../../context/ExpenseContext';
import pfp from "../../../../assets/pfp.png";
import "./sidebar.scss";
import { BarChart3, Receipt, Settings, LogOut, ArrowRight, ArrowLeft} from 'lucide-react';


// Nav items — add new pages here without touching the JSX
const NAV_ITEMS = [
  { href: '/',         icon: BarChart3, label: 'Dashboard' },
  { href: '/Expenses', icon: Receipt,   label: 'Expenses'  },
  { href: '/Settings', icon: Settings,  label: 'Settings'  },
];

function Sidebar() {
  const pathname    = usePathname();
  const { userName } = useExpenses(); // live name from context

  // Controls whether the sidebar is open on tablet/mobile
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar  = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  // Pull first name only for a cleaner display e.g. "Mercy Yakubu" → "Mercy"
  const firstName = userName?.split(" ")[0] ?? userName;

  return (
    <>
      {/* ── Dark overlay — appears behind sidebar on mobile/tablet ──
          Clicking it closes the sidebar */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Floating edge tab — visible on tablet/mobile only ──
          Slides with the sidebar when open */}
      <button
        className={`sidebar-tab ${isOpen ? 'open' : ''}`}
        onClick={isOpen ? closeSidebar : openSidebar}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {/* Arrow flips direction based on open/closed state */}
        <i
          className={`ti ${isOpen ? 'ti-chevron-left' : 'ti-chevron-right'}`}
          aria-hidden="true"
        />
      </button>

      {/* ── Sidebar panel ── */}
      <section className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>

        {/* App name */}
        <h2 className="sidebar-logo">Expen<span>sio.</span></h2>

        {/* Profile pill — name updates live from context */}
        <div className="sidebar-profile">
          <div className="avatar">
            <Image src={pfp} width={36} height={36} alt="profile picture" />
          </div>
          <div className="profile-info">
            {/* Full name from context — updates when changed in Settings */}
            <p className="profile-name">{userName}</p>
            <p className="profile-sub">Personal</p>
          </div>
        </div>

        {/* Section label */}
        <p className="nav-label">Menu</p>

        {/* Nav links — close sidebar on mobile after navigating */}
        <nav className='sidebar-nav'>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`side-nav-links ${pathname === href ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <Icon width={17} height={17} color='#FFF' alt={`${label} icon`} />
              <p>{label}</p>
            </Link>
          ))}
        </nav>

        {/* Logout — pushed to bottom by flex:1 on nav */}
        <button className="logout-btn">
          <LogOut width={20} height={20} color='#FFF' alt="Log Out Icon"/>
          <p>Log Out</p>
        </button>

      </section>
    </>
  );
}

export default Sidebar;