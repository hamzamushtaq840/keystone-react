import React, { useState, useEffect } from 'react';

const CustomDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    const handleOptionClick = (option) => {
        setSelected(option);
        setIsOpen(false);
        onChange(option);
    };

    const options = ['Active', 'Inactive'];

    return (
        <div className="custom-dropdown">
            <div
                className="custom-dropdown__selected h-12 text-base flex items-center focus:ring-transparent "
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selected ? 'text-black' : 'text-gray-700'}>
                    {selected ? selected : 'Select status'}
                </span>
            </div>
            {isOpen && (
                <div className="custom-dropdown__options">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`custom-dropdown__option h-11 text-base flex items-center ${
                                option === selected ? "bg-hoverPrimary hover:bg-hoverPrimary " : ""
                            } hover:bg-white`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
