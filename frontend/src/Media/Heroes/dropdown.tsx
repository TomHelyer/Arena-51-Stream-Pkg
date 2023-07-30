import React, { useState } from "react";
import heroLookup from ".";

interface DropdownProps {
    options: object;
    defaultValue?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, defaultValue = 'unknown' }) => {
    const [selectedOption, setSelectedOption] = useState(defaultValue);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    return (
        <select 
            value={selectedOption}
            onChange={(e) => {
                handleChange;
                setMap(e.target.value);
                fetch(`${apiUrl}/nextmap`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ map: e.target.value }),
                }).catch((err) => console.log(err));
              }}>
        <option value=""></option>
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