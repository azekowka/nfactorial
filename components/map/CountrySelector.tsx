"use client";

import React, { useState, useEffect } from "react";
import { Country } from "@/types/map-types";
import { Search, MapPin, Heart } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch countries data on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags,latlng");
        const data = await response.json();
        
        // Transform API data to our format
        const formattedCountries: Country[] = data.map((country: any) => ({
          name: country.name.common,
          code: country.cca2,
          coordinates: {
            lng: country.latlng[1], // API returns [lat, lng], we need to swap
            lat: country.latlng[0]
          },
          status: null
        }));
        
        // Sort countries alphabetically
        formattedCountries.sort((a, b) => a.name.localeCompare(b.name));
        
        setAllCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCountries();
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries([]);
    } else {
      const filtered = allCountries
        .filter((country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 results for better UI
      
      setFilteredCountries(filtered);
    }
  }, [searchTerm, allCountries]);

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedCountries);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderCountries(items);
  };
  
  // Set country status and add to selected countries
  const addCountryWithStatus = (country: Country, status: 'visited' | 'want-to-visit' | null) => {
    // Don't add if already in the list
    if (selectedCountries.some(c => c.code === country.code)) return;
    
    const updatedCountry = { ...country, status };
    onSelectCountry(updatedCountry);
    setSearchTerm(""); // Clear search after adding
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add Countries</h2>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Search for countries to add to your map
      </p>
      
      {/* Country search and selection */}
      <div className="mb-6">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a country..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
            disabled={isLoading}
          />
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-2 text-gray-500 dark:text-gray-400">
            Loading countries...
          </div>
        )}
        
        {/* Search results with direct action buttons */}
        {!isLoading && filteredCountries.length > 0 && (
          <div className="space-y-2">
            {filteredCountries.map((country) => (
              <div 
                key={country.code}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 overflow-hidden rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <img 
                        src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                        alt={`${country.name} flag`}
                        className="w-full h-auto"
                      />
                    </div>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => addCountryWithStatus(country, 'visited')}
                      className="flex items-center justify-center gap-0.5 py-0.75 px-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                    >
                      <MapPin size={12} />
                      <span className="text-sm">Visited</span>
                    </button>
                    
                    <button
                      onClick={() => addCountryWithStatus(country, 'want-to-visit')}
                      className="flex items-center justify-center gap-0.5 py-0.75 px-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                    >
                      <Heart size={12} />
                      <span className="text-sm">Want to Visit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Trip itinerary */}
      <div>
        <h3 className="font-medium mb-3">Trip Itinerary</h3>
        {selectedCountries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Add countries to create your travel route</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="itinerary">
              {(provided) => (
                <ul
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
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
                          className="p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full w-6 h-6 text-xs">
                              {index + 1}
                            </span>
                            <div className="w-8 h-6 overflow-hidden rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                              <img 
                                src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                                alt={`${country.name} flag`}
                                className="w-full h-auto"
                              />
                            </div>
                            <span className="font-medium">{country.name}</span>
                            
                            {country.status && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                country.status === 'visited' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                                  : 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200'
                              }`}>
                                {country.status === 'visited' ? 'Visited' : 'Want to Visit'}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => onRemoveCountry(country.code)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
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