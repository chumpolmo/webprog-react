"use client"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/ccap.css';
import { Container, Card, Table, Alert } from "react-bootstrap";
import Cookies from "js-cookie";
import cfDat from '../../config/settings.json';
import { db } from "../../config/firebase";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import Link from 'next/link';
import MenuPage from "../menu";
import FooterPage from "../footer";
import { useEffect, useState } from 'react';
import Redirect from "react-router-dom";

function ToDateTime (props) {
    console.log(props.dt);
    const date = new Date(props.dt * 1000);
    console.log(date.toLocaleDateString());
    return date.toLocaleDateString();
}

export default function ActHistory() {
    const dbRef = ref(getDatabase());
    const [numOfAct, setNumOfAct] = useState(0);
    const [actData, setActivities] = useState([]);
    const [actAttData, setActAttendance] = useState([]);
    const [profData, setProfile] = useState([]);

    const handleActivities = async () => {
        const query = ref(db, "Activity");
        return onValue(query, (snapshot) => {
          const data = snapshot.val();
          if (snapshot.exists()) {
            Object.values(data).map((act) => {
              setActivities((acts) => [...acts, act]);
            });
          }
        });
    };

    const handleToRedirect = async () => {
        return window.location.href = '/';
    };

    useEffect(() => {
    if (typeof window !== 'undefined') {
        const handleActAttendance = async () => {
            const query = ref(db, "Users/" + Cookies.get('userId'));
            return onValue(query, (snapshot) => {
              const data = snapshot.val();
              if (snapshot.exists()) {
                Object.values(data.actAttendance).map((act) => {
                  console.log('handleActAttendance: ',act.id);
                  setActAttendance((acts) => [...acts, act]);
                });
                setProfile(data);
                console.log('numOfAct in handleActAttendance :',data.eduProfile.numOfAct);
                // (numOfAct >= cfDat.ACTIVITY_CRITERIA) ? setResNumOfAct(true) : setResNumOfAct(false);
                setNumOfAct(data.eduProfile.numOfAct);
              }
            //   if (snapshot.exists()) {
            //     console.log('User data in handleActAttendance:',data);
            //     setActAttendance(data.actAttendance);
            //     console.log('numOfAct:', data.eduProfile.numOfAct);
            //   }
            });
        };

        console.log('My Cookie: ',Cookies.get('userId'));

        if(!Cookies.get('userId')){
            return async () => {
                await handleToRedirect();
            };
        }else{
            return async () => {
                await handleActAttendance();
                await handleActivities();
                // await handleResNumOfAct();
            };
        }
    }
    }, []);

    return (
        <>
            <MenuPage />
            <Container fluid>
                <h2 className='m-3'>
                    <i className="bi bi-person-check-fill"></i> ประวัติการเข้าร่วมกิจกรรม
                </h2>
                <hr className='border border-primary' />
                <div className='m-3'>
                <Card style={{ width: '100%' }}>
                    <Card.Header>
                        <i className="bi bi-person-vcard"></i> รหัสนักศึกษา : {profData.studentCode} ชื่อ-สกุล : {profData.displayName}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>
                        <i className="bi bi-info-square"></i> ผลการเข้าร่วมกิจกรรม :
                        {
                            numOfAct >= cfDat.ACTIVITY_CRITERIA ? (
                                <Alert key="success" variant="success" className='m-3'>PASSED</Alert>
                            ) :
                            (
                                <Alert key="warning" variant="warning" className='m-3'>FAILED</Alert>
                            )
                        }
                        </Card.Title>
                        <Card.Text className='row justify-content-center mx-auto'>
                        </Card.Text>
                    </Card.Body>
                </Card>
                </div>
                <h3 className='m-3'>
                    <i className="bi bi-person-lines-fill"></i> รายการกิจกรรมที่เข้าร่วม จำนวน {numOfAct} กิจกรรม
                </h3>
                <div className='m-3'>
                <Table striped bordered hover responsive="sm">
                            <thead>
                                <tr>
                                <th className='text-center'>#</th>
                                <th className='text-center'>ชื่อกิจกรรม</th>
                                <th className='text-center'>สถานที่</th>
                                <th className='text-center'>วันที่</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* <pre>
                                {JSON.stringify(actData, '', 2)}
                                {JSON.stringify(actAttData, '', 2)}
                            </pre> */}
                            { actData.map((act, iAct) => (
                                actAttData.map((actAtt, index) => (
                                    iAct === actAtt && 
                                        <tr key={index}>
                                        <td className='text-center'>{act._id}</td>
                                        <td>{act.title}</td>
                                        <td>{act.location.address}</td>
                                        <td className='text-center'><ToDateTime dt={act.dtStart} /></td>
                                        </tr>
                                ))
                              ))
                            }
                            </tbody>
                </Table>
                </div>
                <Link href="/" className='btn btn-secondary m-3'>
                    <i className='bi bi-arrow-left-circle'></i> ย้อนกลับ
                </Link>
            </Container>
            <FooterPage />
        </>
    );
}
