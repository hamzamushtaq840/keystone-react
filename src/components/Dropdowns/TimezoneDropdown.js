import React from 'react';
const TimezoneDropdown = ({ jsonData }) => {
    const timezones = jsonData.data;
  
    return (
      <select>
        {timezones.map((timezone) => (
          <option key={timezone.id} value={timezone.name}>
            {timezone.name} ({timezone.abbreviation})
          </option>
        ))}
      </select>
    );
  };
  