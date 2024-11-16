import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import { Text, Box, Input, Button, VStack, HStack } from "@chakra-ui/react"; // Import Chakra UI components
import Menu from "./menu";
import ConfirmationDialog from "./modal";
import citiesData from "./cities500.json";

const TOTAL_COUNTRIES = 195;


const MapChart = () => {

  const [visitedCountries, setVisitedCountries] = useState([]);
  const [displayMode, setDisplayMode] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);


   const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const matches = citiesData.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(matches.slice(0, 10)); 
    } else {
      setFilteredCities([]);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setFilteredCities([]);
    setSearchQuery("");
  };

  const confirmAddCity = () => {
    if (selectedCity) {
      const { country, lat, lon } = selectedCity;
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      if (!visitedCountries.includes(country)) {
        setVisitedCountries((prev) => [...prev, country]);
      }

      // Add the city's coordinates to the markers state
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      { coordinates: [lonNum, latNum], name: selectedCity.name },
    ]);


      //alert(`${selectedCity.name} has been added to your visited cities.`);

      setSelectedCity(null);
      
    }
  };

  const handleCountryClick = (geo) => {
      setVisitedCountries((prev) =>
        prev.includes(geo.id) ? prev.filter((id) => id !== geo.id) : [...prev, geo.id]
      );
    }; 

    


  const cycleDisplayMode = () => {
    setDisplayMode((prevMode) => (prevMode + 1) % 3);
  };

  const calculateDisplayText = () => {
    switch (displayMode) {
      case 0:
        return `${visitedCountries.length} Countries Visited`;
      case 1:
        const percentage = ((visitedCountries.length / TOTAL_COUNTRIES) * 100).toFixed(2);
        return `${percentage}% of the World Traveled`;
      //case 2:
        //return `Visited Continents: ${visitedCountries.join(", ")}`; // Display list of countries visited
      default:
        return `${visitedCountries.length} Countries Visited`;
    }
  };

  return (
    <div>
     <Box position="fixed" top="10px" width="100%" textAlign="center">
        <Text
          onClick={cycleDisplayMode}
          fontSize="2xl"
          fontWeight="bold"
          color="teal.500"
          cursor="pointer"
          _hover={{ color: "teal.600" }}
          p={2}
          
        >
          {calculateDisplayText()}
        </Text>
      </Box>
      <Menu />
      {/* Search bar and dropdown */}
      <Box position="fixed" top="15px" right="20px" width="250px" borderColor="white" >
        <Input
          placeholder="Search for a city you visted..."
          value={searchQuery}
          onChange={handleSearchChange}
          mb={2}
          borderColor="white"
          p={4}
          bg={"white"}
          borderRadius="sm"
          shadow={"md"}
          size="lg"
          
        />
        <VStack align="start" spacing={3} bg="white" borderRadius="md" shadow="md" maxHeight="200px" overflow="auto">
          {filteredCities.map((city) => (
            <Button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              size="sm"
              variant="ghost"
              width="100%"
              p={4}
              justifyContent="flex-start" //hello added this
            >
              {city.name}, {city.country}
            </Button>
          ))}
        </VStack>
      </Box>

      {/* Confirmation popup */}
      <ConfirmationDialog
        isOpen={!!selectedCity}
        onClose={() => setSelectedCity(null)}
        onConfirm={confirmAddCity}
        cityName={selectedCity?.name}
      />
      {/* Map */}
      <ComposableMap projection="geoMercator">
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography="/featuress.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = geo.properties.ISO_A2;
                const isSelected = visitedCountries.includes(geo.id); // Check if country is selected
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={() => setHoveredCountry(geo.properties.name)} 
                    onMouseLeave={() => setHoveredCountry("")} 
                    style={{
                      default: {
                        fill: isSelected ? "#C2FABB" : "#EEE", 
                        stroke: "#FFF", 
                        strokeWidth: 0.5, 
                        outline: "none",
                      },
                      hover: {
                        fill: isSelected ? "#64E639" : "#F53", 
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#C2FABB", 
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

      {markers.map((marker, i) => (
      <Marker key={i} coordinates={marker.coordinates} onMouseEnter={() => setHoveredMarkerIndex(i)}
      onMouseLeave={() => setHoveredMarkerIndex(null)}>
        <circle r={0.5} fill="#42C4DB"  />
        {hoveredMarkerIndex === i && (
        <text
          textAnchor="middle"
          y={-3}
          style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "7px",
            pointerEvents: "none",
          }}
          
        >
          {marker.name}
        </text>
        )}
      </Marker>
    ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Hover Box at Bottom Left */}
      {hoveredCountry && (
        <div style={{
          position: "fixed",
          bottom: "10px",
          left: "15px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "18px"
        }}>
          {hoveredCountry}
        </div>
      )}
    </div>
  );
};

export default MapChart;





