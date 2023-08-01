import React, { useState } from "react";
import heroLookup from ".";

interface HeroBanDropdownProps {
    onSelectedHeroesChange: (selectedHeroes: string[]) => void;
}

interface DropdownProps {
    options: object;
    defaultValue?: string;
    onChange: (selectedHero: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, defaultValue = 'unknown', onChange }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <select 
            value={defaultValue} 
            onChange={handleChange}
            >
                <option value=""></option>
                {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                ))}
        </select>
    );
};

const HeroBanDropdown: React.FC<HeroBanDropdownProps> = ({onSelectedHeroesChange}) => {
    const numberOfDropdowns = 5;
    const [selectedHeroes, setSelectedHeroes] = useState<string[]>(Array.from({ length: numberOfDropdowns }, () => "unknown"));
    const handleDropdownChange = (index: number, selectedHero: string) => {
        const newSelectedHeroes = [...selectedHeroes];
        newSelectedHeroes[index] = selectedHero;
        setSelectedHeroes(newSelectedHeroes);
        onSelectedHeroesChange(newSelectedHeroes);
    }
    const dropdownArray = Array.from({ length: numberOfDropdowns }, (_, index) => (
      <Dropdown
        key={index}
        options={heroLookup}
        defaultValue={selectedHeroes[index]}
        onChange={(selectedHero) => handleDropdownChange(index, selectedHero)}
        />
    ));
  
    return <div>{dropdownArray}</div>;
  };

export default HeroBanDropdown;