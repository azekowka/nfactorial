"use client";

import React, { useState, useEffect } from "react";
import { Country } from "@/types/map-types";
import { Search } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Sample data for countries (in a real app, this would come from an API)
const COUNTRIES_DATA: Country[] = [
  { name: "United States", code: "US", coordinates: { lng: -95.7129, lat: 37.0902 } },
  { name: "United Kingdom", code: "UK", coordinates: { lng: -0.1278, lat: 51.5074 } },
  { name: "France", code: "FR", coordinates: { lng: 2.3522, lat: 48.8566 } },
  { name: "Germany", code: "DE", coordinates: { lng: 13.4050, lat: 52.5200 } },
  { name: "Japan", code: "JP", coordinates: { lng: 139.6917, lat: 35.6895 } },
  { name: "Australia", code: "AU", coordinates: { lng: 149.1300, lat: -35.2809 } },
  { name: "Brazil", code: "BR", coordinates: { lng: -47.9297, lat: -15.7801 } },
  { name: "Canada", code: "CA", coordinates: { lng: -75.6972, lat: 45.4215 } },
  { name: "China", code: "CN", coordinates: { lng: 116.4074, lat: 39.9042 } },
  { name: "India", code: "IN", coordinates: { lng: 77.2090, lat: 28.6139 } },
  { name: "Russia", code: "RU", coordinates: { lng: 37.6173, lat: 55.7558 } },
  { name: "South Africa", code: "ZA", coordinates: { lng: 28.0473, lat: -26.2041 } },
  { name: "Italy", code: "IT", coordinates: { lng: 12.4964, lat: 41.9028 } },
  { name: "Spain", code: "ES", coordinates: { lng: -3.7038, lat: 40.4168 } },
  { name: "Mexico", code: "MX", coordinates: { lng: -99.1332, lat: 19.4326 } },
  { name: "Egypt", code: "EG", coordinates: { lng: 31.2357, lat: 30.0444 } },
  { name: "Argentina", code: "AR", coordinates: { lng: -58.3816, lat: -34.6037 } },
  { name: "Thailand", code: "TH", coordinates: { lng: 100.5018, lat: 13.7563 } },
  { name: "New Zealand", code: "NZ", coordinates: { lng: 174.7787, lat: -41.2924 } },
  { name: "Greece", code: "GR", coordinates: { lng: 23.7275, lat: 37.9838 } },
];

interface CountrySelectorProps {
  selectedCountries: Country[];
  onSelectCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
  onReorderCountries: (reorderedCountries: Country[]) => void;
}

const CountrySelector = ({
  selectedCountries,
  onSelectCountry,
  onRemoveCountry,
  onReorderCountries,
}: CountrySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(COUNTRIES_DATA);
  
  // Helper function to get country flag emoji
  const getCountryFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries(COUNTRIES_DATA);
    } else {
      const filtered = COUNTRIES_DATA.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm]);

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedCountries);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderCountries(items);
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Select Countries</h2>
      
      {/* Search input */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
        />
      </div>
      
      {/* Country list */}
      <div className="h-40 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-700 rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCountries.map((country) => (
            <li
              key={country.code}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
              onClick={() => onSelectCountry(country)}
            >
              <div className="flex items-center">
                <span className="text-xl mr-2">{getCountryFlagEmoji(country.code)}</span>
                <span>{country.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {country.coordinates.lat.toFixed(2)}, {country.coordinates.lng.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Selected countries */}
      <div>
        <h3 className="font-medium mb-2">Trip Itinerary</h3>
        {selectedCountries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No countries selected yet</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="itinerary" isDropDisabled={false}>
              {(provided) => (
                <ul
                  className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {selectedCountries.map((country, index) => (
                    <Draggable key={country.code} draggableId={country.code} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 bg-white dark:bg-gray-800 flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <span className="mr-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span className="text-xl mr-2">{getCountryFlagEmoji(country.code)}</span>
                            <span>{country.name}</span>
                          </div>
                          <button
                            onClick={() => onRemoveCountry(country.code)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            ✕
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default CountrySelector; 