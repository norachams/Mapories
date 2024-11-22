import { Provider } from "./components/ui/provider"
import MapChart from './mapchart';
import './styles.css'; 
import React, { useEffect } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { app } from './firebase'; 


function App() {
  useEffect(() => {
    const auth = getAuth(app);
    signInAnonymously(auth)
      .then(() => {
        console.log('Signed in anonymously');
      })
      .catch((error) => {
        console.error('Error signing in anonymously:', error);
      });
  }, []);

  return (
    <Provider >
      <MapChart />
    </Provider>
  );
}

export default App;
