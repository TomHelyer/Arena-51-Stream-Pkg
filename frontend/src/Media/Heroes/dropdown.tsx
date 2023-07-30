import React, { useState } from "react";
import heroLookup from ".";

interface DropdownProps {
    options: object;
}

const Dropdown: React.FC<DropdownProps> = ({ options }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    return (
        <select value={selectedOption} onChange={handleChange}>
        <option value="">Select an option</option>
        {Object.entries(options).map(([key, value]) => (
            <option key={key} value={key}>
                {value}
            </option>
        ))}
        </select>
    );
};

const HeroBanDropdown: React.FC = () => {
    const numberOfDropdowns = 5;
    const dropdownArray = Array.from({ length: numberOfDropdowns }, (_, index) => (
      <Dropdown key={index} options={heroLookup} />
    ));
  
    return <div>{dropdownArray}</div>;
  };

export default HeroBanDropdown;