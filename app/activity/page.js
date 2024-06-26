'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/ccap.css';
import { Container, Button, Image, Row, Col, Card } from 'react-bootstrap';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { onValue, ref } from "firebase/database";
import Link from 'next/link';
import MenuPage from '../menu';
import FooterPage from '../footer';

function ToDateTime (props) {
  console.log(props.dt);
  const date = new Date(props.dt * 1000);
  console.log(date.toLocaleDateString());
  return date.toLocaleDateString();
}

function Activities() {
    const [acts, setActivities] = useState([]);

    useEffect(() => {
        const query = ref(db, "Activity");
        return onValue(query, (snapshot) => {
          const data = snapshot.val();
    
          if (snapshot.exists()) {
            Object.values(data).map((act) => {
              setActivities((acts) => [...acts, act]);
            });
          }
        });
    }, []);

    return (
      <>
      <MenuPage />
        <Container fluid>
            <h2 className='m-3'>
              <i class="bi bi-person-check-fill"></i> กิจกรรมพัฒนานักศึกษาวิทยาลัยชุมชน
            </h2>
            <hr className='border border-primary' />
            {
              <Row className="justify-content-md-center m-1 p-2">
                {
                  acts.map((act, index) => (
                  <Col sm className='mb-2'>
                    <Card style={{ width: '23rem' }} className='bg-info-subtle'>
                      <Card.Body>
                        <Card.Title>{act.title}</Card.Title>
                        <hr />
                        <Card.Subtitle className="mb-2 text-muted">
                        <i className='bi bi-calendar-event'></i> วันที่: <ToDateTime dt={act.dtStart} /><br/>
                        <i className='bi bi-geo-alt'></i> สถานที่: {act.location.address}
                        </Card.Subtitle>
                        <Card.Text>
                          {act.description}
                          <p>หมายเหตุ: {act.note}</p>
                        </Card.Text>
                        <Card.Link href={`/activity/${index}/${Cookies.get('userId')}`} className='btn btn-primary'>
                          <i className='bi bi-file-text'></i> รายละเอียด
                        </Card.Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              }
              </Row>
            }
            <Link href="/" className='btn btn-secondary m-3'>
             <i className='bi bi-arrow-left-circle'></i> ย้อนกลับ
            </Link>
        </Container>
        <FooterPage />
      </>
    );
}

export default Activities;