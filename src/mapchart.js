import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

const MapChart = () => {
  // State to store the list of selected countries
  const [selectedCountries, setSelectedCountries] = useState([]);

  // Function to handle click on a country
  const handleCountryClick = (geo) => {
    // Toggle country selection
    setSelectedCountries((prevSelected) =>
      prevSelected.includes(geo.id)
        ? prevSelected.filter((id) => id !== geo.id)
        : [...prevSelected, geo.id] 
    );
  };

  return (
    <div>
      <ComposableMap projection="geoMercator">
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography="/features.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedCountries.includes(geo.id); // Check if country is selected
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: isSelected ? "#C2FABB" : "#EEE", // Color selected countries differently
                        stroke: "#FFF", 
                        strokeWidth: 0.5, 
                        outline: "none",
                        boxShadow: "none",
                      },
                      hover: {
                        fill: isSelected ? "#C2FABB" : "#F53", // Hover color, but selected countries stay the same
                        outline: "none",
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
    </div>
  );
};

export default MapChart;





