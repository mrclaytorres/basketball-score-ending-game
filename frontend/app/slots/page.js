"use client";
import React, { useState, useEffect } from 'react';

export default function SlotSelectionPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Load saved slot from local storage
  useEffect(() => {
    const savedSlot = localStorage.getItem('selectedSlot');
    if (savedSlot) {
      setSelectedSlot(parseInt(savedSlot));
    }
  }, []);

  // Save slot selection to local storage
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    localStorage.setItem('selectedSlot', slot);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Your Slot (00-99)</h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 100 }, (_, i) => (
          <button
            key={i}
            className={`p-10 rounded ${
              selectedSlot === i ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => handleSlotSelect(i)}
          >
            {i.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
      {selectedSlot !== null && (
        <div className="mt-4">
          <p className="text-xl">Selected Slot: <strong>{selectedSlot.toString().padStart(2, '0')}</strong></p>
        </div>
      )}
    </div>
  );
}
