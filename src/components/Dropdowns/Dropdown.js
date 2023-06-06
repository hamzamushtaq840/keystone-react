import React, { useState, useEffect } from 'react';

const Dropdown = ({ values, value, onChange, onAddMore, onFetchedCommodity, onFetchedRate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleValueClick = (value, isNewValue = false) => {
    setSelectedValue(value);
    setSearchTerm('');
    setIsOpen(false);

    if (isNewValue) {
      onAddMore(value);
    }

    onChange(value); // Add this line
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && e.target.value === selectedValue) {
      setSelectedValue('');
      if (onChange) {
        onChange('');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      toggleDropdown();
    }
  };

  const filteredValues = values.filter(value =>
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isNewValue = searchTerm !== '' && filteredValues.length === 0;

  return (
    <div className="relative inline-block text-left w-full ">
      <input
        className="text-left  rounded-md border h-12 border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium modal_btn_custom text-gray-700 w-full"
        type="text"
        value={searchTerm || selectedValue || onFetchedCommodity || onFetchedRate } // Change defaultValue to value
        placeholder={selectedValue || 'Select Value'}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={toggleDropdown}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-full max-h-36 overflow-y-auto ">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {filteredValues.map((value, index) => (
              <button
                key={index}
                className="block px-4 py-2 text-base text-gray-700 hover:bg-hoverPrimary hover:text-gray-900 w-full text-left rounded-lg"
                role="menuitem"
                onClick={() => handleValueClick(value)}
              >
                {value}
              </button>
            ))}
            {isNewValue && (
              <button
                className="block px-4 py-2 text-base text-gray-700 hover:bg-hoverPrimary hover:text-gray-900 w-full text-left rounded-lg"
                role="menuitem"
                onClick={() => handleValueClick(searchTerm, true)}
              >
                Add "{searchTerm}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
