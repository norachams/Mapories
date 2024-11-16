// Import ChakraProvider from Chakra UI
import { Provider } from "./components/ui/provider"
import React from 'react';
import MapChart from './mapchart';
import './styles.css'; 
import theme from './theme'; // Import your custom theme
import Menu from './menu';


function App() {
  return (
    <Provider >
      <MapChart />
      {/* Other components */}
    </Provider>
  );
}

export default App;
