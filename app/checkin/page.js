'use client'

import React, { useEffect, useState } from 'react';
import { db } from "../../config/firebase";
import { getDatabase, ref, child, push, increment, update, get } from "firebase/database";
import Cookies from "js-cookie";

function useGeoLocation() {
  const dbRef = ref(getDatabase());
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [attLogs, setAttLogs] = useState(true);

  // Fine
  const handleSetAttLogs = () => {
    setAttLogs(false);
  };

  const handleIncAttQua = async () => {
    try {
      const dbRef = ref(getDatabase());
      const updates = {};
      updates[`Activity/2/attQuantity`] = increment(1);
      await update(dbRef, updates);
      console.log('Updated data...');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleIncNumOfAct = async () => {
    try {
      const dbRef = ref(getDatabase());
      const updates = {};
      updates[`Users/0/eduProfile/numOfAct`] = increment(1);
      await update(dbRef, updates);
      console.log('Updated data (numOfAct)...');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleAttLogs = async () => {
    try {
      const updates = {};
      const newPostKey = push(child(ref(db), 'Activity')).key;

      // Updating...
      updates[`/Activity/2/attendanceLogs/${newPostKey}/`] = Cookies.get('userEmail'); // It works like!
      update(dbRef, updates);
      handleIncAttQua();
      handleIncNumOfAct();
      console.log("You will be able to enroll for the event.");

      setAttLogs(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }

    try {
      get(child(dbRef, `/Activity/2/attendanceLogs`)).then((snapshot) => {
        snapshot.forEach((emailSnapshot) => {
          if(emailSnapshot.val() === Cookies.get('userEmail')){
            console.log('Your has already checked in for the activity.');
            handleSetAttLogs();
          }
        });
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }
    return () => {};
  }, []);

  return (
    <>
    lat: {location.latitude}<br/>
    lon: {location.longitude}<br/>
    {/* <pre>{JSON.stringify(attLogs, 2, '')}</pre> */}
    {
      attLogs ? 
      <button onClick={handleAttLogs}>Check-in</button>:
      <button disabled>คุณ Check-in ในกิจกรรมนี้สำเร็จแล้ว</button>
    }
    </>
  );
}

export default useGeoLocation;