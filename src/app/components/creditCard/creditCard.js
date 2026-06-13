"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import chip from "../../../../assets/chip.png"
import visa from "../../../../assets/visa.png";
import map from '../../../../assets/map.png'
import { useExpenses } from "../../context/ExpenseContext";
import "./creditCard.scss";

function CreditCard() {
  // Pull live values from context
  const { availableBalance, userName } = useExpenses();

  // Format a number as a readable Naira string e.g. 175000 → "175,000"
  const fmt = (n) => n.toLocaleString("en-NG");

  // Fix hydration mismatch — server has no localStorage so renders 0,
  // client reads the real value. Wait until mounted before showing data.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="credit-card card">
      <Image className='map' src={map} width={100} height={100} alt='map'/>
      <div className='card-top'>
        <Image src={chip} width={30} height={25} alt='chip'/>
        <Image src={visa} width={50} height={20} alt="Visa Card logo" />
      </div>

      {/* Available balance — income minus all expenses */}
      <div className='balance'>
        <span>Available Balance</span>
        <p>{mounted ? `₦${fmt(availableBalance)}` : '—'}</p>
      </div>

      <div className='card-bottom'>
        <div>
          <span>card holder</span>
          <p>{mounted ? userName : '—'}</p>
        </div>

        <div>
          <span>Valid till</span>
          <p>06 / 28</p>
        </div>
      </div>

    </div>
  );
}

export default CreditCard;