import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

const TOTAL_COUNTRIES = 195;

const MapChart = () => {
  // State to store the list of selected countries
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [displayMode, setDisplayMode] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState("");

  
  // Function to handle click on a country
  const handleCountryClick = (geo) => {
    // Toggle country selection
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
        <h2 onClick={cycleDisplayMode} style={{ position: "fixed", top: "10px", width: "100%", textAlign: "center", cursor: "pointer" }}>
        {calculateDisplayText()}
      </h2>
      <ComposableMap projection="geoMercator">
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography="/features.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = visitedCountries.includes(geo.id); // Check if country is selected
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={() => setHoveredCountry(geo.properties.name)} // Set country name on hover
                    onMouseLeave={() => setHoveredCountry("")} // Clear country name on hover out
                    style={{
                      default: {
                        fill: isSelected ? "#C2FABB" : "#EEE", // Color selected countries differently
                        stroke: "#FFF", 
                        strokeWidth: 0.5, 
                        outline: "none",
                      },
                      hover: {
                        fill: isSelected ? "#64E639" : "#F53", // Hover color, but selected countries stay the same
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#C2FABB", // Pressed color
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
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





