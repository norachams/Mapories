import React, { useState ,useEffect}  from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import { Text, Box, Input, Button, VStack, HStack } from "@chakra-ui/react";
import Menu from "./menu";

import ConfirmationDialog from "./modal";
import citiesData from "./cities500.json";
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import mapData from './feature.json'; 
import PhotoGalleryDialog from "./PhotoGalleryDialog";
import FileUploadDialog from "./uploadfile";
import { db,auth } from './firebase';
import { doc, setDoc, deleteDoc,  } from 'firebase/firestore';
import { collection,updateDoc, onSnapshot} from 'firebase/firestore'; 
import { signInAnonymously,onAuthStateChanged } from 'firebase/auth';


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
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [selectedMarkerForUpload, setSelectedMarkerForUpload] = useState(null);
  const [user, setUser] = useState(null);

  const geoJsonData = feature(mapData, mapData.objects.countries); 
  const countryFeatures = geoJsonData.features;


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "markers"), (snapshot) => {
      const markersData = snapshot.docs.map((doc) => doc.data());
      setMarkers(markersData);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "countries"), (snapshot) => {
      const countriesData = snapshot.docs.map((doc) => doc.id);
      setVisitedCountries(countriesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    signInAnonymously(auth)
      .then(() => {
        console.log("Signed in anonymously");
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setFilteredCities([]);
    setSearchQuery("");
  };

  

  const handleAddPhotos = (marker) => {
    setSelectedMarkerForUpload(marker);
    setIsFileUploadOpen(true);
  };

  const handleCountryClick = (geo) => {
    setVisitedCountries((prev) => {
      const updatedCountries = prev.includes(geo.id)
        ? prev.filter((id) => id !== geo.id)
        : [...prev, geo.id];
      console.log("Updated visitedCountries:", updatedCountries);

      const docRef = doc(db, 'countries', geo.id.toString());
      if (updatedCountries.includes(geo.id)) {

        setDoc(docRef, { id: geo.id })
          .then(() => {
            console.log(`Country ${geo.id} added to Firestore`);
          })
          .catch((error) => {
            console.error('Error adding country to Firestore:', error);
          });
      } else {

        deleteDoc(docRef)
          .then(() => {
            console.log(`Country ${geo.id} removed from Firestore`);
          })
          .catch((error) => {
            console.error('Error removing country from Firestore:', error);
          });
      }

      return updatedCountries;
    });
  };


const confirmAddCity = async (files = []) => {
  try {
    console.log('confirmAddCity called with files:', files);
    if (selectedCity) {
      const { country, lat, lon } = selectedCity;
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      const cityCoordinates = [lonNum, latNum];

      const countryFeature = countryFeatures.find((feature) =>
        geoContains(feature, cityCoordinates)
      );

      let countryId = null;
        if (countryFeature) {
          countryId = countryFeature.id;

          if (!visitedCountries.includes(countryId)) {
            setVisitedCountries((prev) => {
              const updatedCountries = [...prev, countryId];

              // Save the country to Firestore
              const docRef = doc(db, "countries", countryId.toString());
              setDoc(docRef, { id: countryId })
                .then(() => {
                  console.log(`Country ${countryId} added to Firestore`);
                })
                .catch((error) => {
                  console.error("Error adding country to Firestore:", error);
                });

              return updatedCountries;
            });
          }
        }

      const markerData = {
        countryId, 
        coordinates: cityCoordinates,
        name: selectedCity.name,
        //photos: imageUrls,
      };

      setMarkers((prevMarkers) => [...prevMarkers, markerData]);

      // Save marker data to Firestore
      try {
        await setDoc(doc(db, 'markers', selectedCity.name), markerData);
        console.log('Marker data saved successfully');
      } catch (error) {
        console.error('Error saving marker data:', error);
      }

      setSelectedCity(null);
    }
  } catch (error) {
    console.error('Error in confirmAddCity:', error);
  }
};

   const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const matches = citiesData.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(matches.slice(0, 20)); 
    } else {
      setFilteredCities([]);
    }
  };

  const handleMarkerClick = (index) => {
  setSelectedMarkerIndex(index);
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

  
  const handleFileUploadSubmit = async (files) => {
    if (files.length > 0) {
      try {
        const updatedMarkers = markers.map((m) => {
          if (m.name === selectedMarkerForUpload.name) {
            const updatedPhotos = [...(m.photos || []), ...files];
            updateDoc(doc(db, 'markers', m.name), { photos: updatedPhotos });
            return { ...m, photos: updatedPhotos };
          }
          return m;
        });
  
        setMarkers(updatedMarkers);
      } catch (error) {
        console.error('Error updating marker with new photos: ', error);
      }
    }
  
    setIsFileUploadOpen(false);
    setSelectedMarkerForUpload(null);
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
      <Box position="fixed" top="15px" right="20px" width="290px" borderColor="white" >
       {/*} <InputGroup
          flex="1"
          startElement={<LuSearch />}
          position="center"
         
          > */}
        <Input
          placeholder="Search for a city you visted..."
          value={searchQuery}
          onChange={handleSearchChange}
          mb={2}
          borderColor="white"
          p={4}
          bg={"white"}
          borderRadius="2xl"
          shadow={"md"}
          size="lg"
          
        />
       {/* </InputGroup>*/}
        <VStack align="start" spacing={3} bg="white" borderRadius="md" shadow="md" maxHeight="200px" overflow="auto">
          {filteredCities.map((city) => (
            <Button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              size="sm"
              variant="ghost"
              width="100%"
              p={4}
              justifyContent="flex-start"
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
      onConfirmWithFiles={confirmAddCity} 
      cityName={selectedCity?.name}
    />
      {/* Map */}
      <ComposableMap projection="geoMercator">
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography={mapData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                
                const isSelected = visitedCountries.includes(geo.id);
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
      onMouseLeave={() => setHoveredMarkerIndex(null)}  onClick={() => handleMarkerClick(i)} >
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

    {/* Photo Gallery Dialog */}
    {selectedMarkerIndex !== null && (
  <PhotoGalleryDialog
    isOpen={true}
    onClose={() => setSelectedMarkerIndex(null)}
    marker={markers[selectedMarkerIndex]}
    //onDeletePhoto={handleDeletePhoto}
    onAddPhotos={handleAddPhotos}
  />
)}


    {/* File Upload Dialog for adding photos to existing markers */}
    {isFileUploadOpen && selectedMarkerForUpload && (
        <FileUploadDialog
          isOpen={isFileUploadOpen}
          onClose={() => {
            setIsFileUploadOpen(false);
            setSelectedMarkerForUpload(null);
          }}
          onSubmit={handleFileUploadSubmit}
        />
      )}

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





