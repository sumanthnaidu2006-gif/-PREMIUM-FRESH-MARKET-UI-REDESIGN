import React, { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { useAppAuth } from '../../context/AuthContext';

export const LocationModal = ({ isOpen, onClose }) => {
  const { deliveryLocation, updateLocation } = useAppAuth();
  const [city, setCity] = useState(deliveryLocation.city);
  const [postalCode, setPostalCode] = useState(deliveryLocation.postalCode);
  const [stateCode, setStateCode] = useState(deliveryLocation.state || 'WA');

  if (!isOpen) return null;

  const presets = [
    { city: 'Seattle', state: 'WA', postalCode: '98101' },
    { city: 'San Francisco', state: 'CA', postalCode: '94103' },
    { city: 'New York', state: 'NY', postalCode: '10001' },
    { city: 'Austin', state: 'TX', postalCode: '78701' },
    { city: 'Chicago', state: 'IL', postalCode: '60601' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && postalCode.trim()) {
      updateLocation(city.trim(), stateCode.trim(), postalCode.trim());
      onClose();
    }
  };

  const handleSelectPreset = (preset) => {
    setCity(preset.city);
    setStateCode(preset.state);
    setPostalCode(preset.postalCode);
    updateLocation(preset.city, preset.state, preset.postalCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3D9] bg-[#E9F0E7]/40">
          <div className="flex items-center gap-2 text-[#1D4232]">
            <MapPin className="w-5 h-5 text-[#285943]" />
            <h2 className="font-semibold text-lg">Choose Delivery Location</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#667168] hover:text-[#252D27] hover:bg-[#FFFFFF] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-[#667168] mb-4">
            Select your delivery destination to see real-time product availability and scheduled fresh deliveries.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#252D27] uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-[#252D27] text-sm focus:outline-none focus:ring-2 focus:ring-[#285943] bg-[#F8F7F0]"
                  placeholder="e.g. Seattle"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#252D27] uppercase tracking-wider mb-1.5">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-[#252D27] text-sm focus:outline-none focus:ring-2 focus:ring-[#285943] bg-[#F8F7F0]"
                  placeholder="e.g. 98101"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-medium text-sm transition-colors shadow-xs active:scale-[0.99]"
            >
              Update Delivery Location
            </button>
          </form>

          <div>
            <span className="block text-xs font-semibold text-[#667168] uppercase tracking-wider mb-2.5">
              Popular Metropolitan Areas
            </span>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset) => {
                const isSelected = deliveryLocation.postalCode === preset.postalCode;
                return (
                  <button
                    key={preset.postalCode}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm text-left transition-all ${
                      isSelected
                        ? 'border-[#285943] bg-[#E9F0E7] text-[#1D4232] font-semibold'
                        : 'border-[#E5E3D9] bg-[#FFFFFF] hover:bg-[#F8F7F0] text-[#252D27]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#285943]' : 'text-[#667168]'}`} />
                      <span>{preset.city}, {preset.state}</span>
                      <span className="text-xs text-[#667168]">({preset.postalCode})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#285943]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
