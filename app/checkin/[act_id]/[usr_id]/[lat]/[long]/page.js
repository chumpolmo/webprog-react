'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../../../../../css/ccap.css';
import { Container, Button, Image, Card } from 'react-bootstrap';
import cfDat from '../../../../../../config/settings.json';
import { db } from "../../../../../../config/firebase";
import { getDatabase, ref, child, push, increment, update, get, onValue } from "firebase/database";
import { React, useEffect, useState } from "react";
import distance from 'geo-coords-distance';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Cookies from "js-cookie";
import useGeoLocation from "./useGeoLocation";
import MenuPage from '../../../../../menu';
import FooterPage from '../../../../../footer';

function actCheckIn () {
    const dbRef = ref(getDatabase());
    const [attDist, setDistance] = useState(false);
    const [attLogs, setAttLogs] = useState(true);
    const [actData, setActivities] = useState([]);

    const params = useParams();
    const act_id = params.act_id;
    const usr_id = params.usr_id;
    const act_lat = params.lat;
    const act_long = params.long;

    const { lat, lon } = useGeoLocation();
    
    // Geolocations --> Coding Here...
    const firstPoint = {lat: act_lat, lng: act_long};
    const secondPoint = {lat: lat, lng: lon};
    const result = distance(firstPoint, secondPoint);

    const handleActivities = async () => {
        const query = ref(db, "Activity/" + act_id);
        return onValue(query, (snapshot) => {
          const data = snapshot.val();
          if (snapshot.exists()) {
            setActivities(data);
          }
        });
    };

    // ---------------------------
    // -- Don't DELETE the code --
    // ---------------------------
    const handleIncAttQua = async () => {
        try {
          const updates = {};
          updates[`Activity/${act_id}/attQuantity`] = increment(1);
          await update(dbRef, updates);
          console.log('Updated data...');
        } catch (error) {
          console.error('Error updating data:', error);
        }
    };
    
    const handleIncNumOfAct = async () => {
        try {
          const updates = {};
          updates[`Users/${Cookies.get('userId')}/eduProfile/numOfAct`] = increment(1);
          await update(dbRef, updates);
          console.log('Updated data (numOfAct)...');
        } catch (error) {
          console.error('Error updating data:', error);
        }
    };
    // ---------------------------

    const handleActAtt = async () => {
        try {
          const updates = {};
          const newPostKey = push(child(ref(db), 'Users')).key;
          updates[`Users/${Cookies.get('userId')}/actAttendance/${newPostKey}`] = act_id;
          await update(dbRef, updates);
          console.log('Updated data (actAttendance)...');
        } catch (error) {
          console.error('Error updating data (actAttendance):', error);
        }
    };

    const handleAttLogs = async () => {
        try {
          const updates = {};
          const newPostKey = push(child(ref(db), 'Activity')).key;
    
          // Updating...
          updates[`Activity/${act_id}/attendanceLogs/${newPostKey}`] = Cookies.get('userEmail'); // It works like!
          await update(dbRef, updates);
          await handleIncAttQua();
          await handleActAtt();
          await handleIncNumOfAct();
          console.log("You will be able to enroll for the event.");
    
          setAttLogs(false);
        } catch (error) {
          console.error('Error updating data:', error);
        }
    };

    useEffect(() => {
        console.log('Lat:', act_lat, lat);
        console.log('Long:', act_long, lon);    
        console.log('Distance: ', result.toFixed(2));
        console.log('D. Cond.: ', cfDat.CHECKIN_DISTANCE);
        if(result.toFixed(2) <= cfDat.CHECKIN_DISTANCE){
            setDistance(true);
        }else{
            setDistance(false);
        }

        try {
            handleActivities();

            get(child(dbRef, `/Activity/${act_id}/attendanceLogs`)).then((snapshot) => {
              snapshot.forEach((emailSnapshot) => {
                if(emailSnapshot.val() === Cookies.get('userEmail')){
                  console.log('Your has already checked in for the activity.');
                  setAttLogs(false);
                }
              });
            });
        } catch (error) {
            console.error('Error updating data:', error);
        }
        return () => {};
    }, [lat, lon]);

    return (
        <>
            <MenuPage />
            <Container fluid>
                <h2 className='m-3'>
                    <i class="bi bi-geo-alt"></i> การ Check-in เพื่อเข้าร่วมการกิจกรรมพัฒนานักศึกษา
                </h2>
                <hr className='border border-primary' />
                <p>
                {
                    attDist ? (
                    <Card border="success text-success" style={{ width: '100%' }}>
                        <Card.Header><i class="bi bi-check-circle"></i> คุณสามารถ Check-in เข้าร่วมกิจกรรมได้ กรุณากดปุ่ม Check-in</Card.Header>
                        <Card.Body>
                            <Card.Title><i class="bi bi-bookmark-check"></i> หัวข้อกิจกรรม "{actData.title}"</Card.Title>
                            <Card.Text className='row justify-content-center mx-auto'>
                        { attLogs ? (
                            <Button variant="primary" className='m-3 col-4' onClick={handleAttLogs}><i class="bi bi-patch-check"></i> ยืนยันการเข้าร่วมกิจกรรม</Button> ) : (
                            <Button variant="secondary" className='m-3 col-4' disabled><i class="bi bi-geo-alt"></i> คุณ Check-in ในกิจกรรมนี้สำเร็จแล้ว</Button>
                        )
                        }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    ) : (
                    <Card border="danger text-danger" style={{ width: '100%' }}>
                        <Card.Header><i class="bi bi-x-circle"></i> คุณไม่สามารถ Check-in เข้าร่วมกิจกรรมได้</Card.Header>
                        <Card.Body>
                            <Card.Title><i class="bi bi-bookmark-check"></i>  หัวข้อกิจกรรม "{actData.title}"</Card.Title>
                            <Card.Text className='row justify-content-center mx-auto'>เนื่องจากระยะทางที่คุณ Check-in ห่างจากสถานที่อบรม ประมาณ {result.toFixed(2)} เมตร<br />
                            ***ซึ่งเกินกว่าระยะทางที่ทางสถาบันกำหนด กรุณา Check-in ภายในสถานที่จัดกิจกรรมเท่านั้น***
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    )
                }
                </p>
                <Link href={`/activity/${act_id}/${usr_id}`} className='btn btn-secondary m-3'>
                <i className='bi bi-arrow-left-circle'></i> ย้อนกลับ
                </Link>
            </Container>
            <FooterPage />
        </>
    );
};

export default actCheckIn;