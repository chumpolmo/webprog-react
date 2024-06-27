"use client"

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../css/ccap.css';
import { Container, Button, Image, Card, Row, Col } from 'react-bootstrap';
import { React, useEffect, useState } from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import QRCode from "react-qr-code";
import Cookies from "js-cookie";
import { db } from "../../../../config/firebase";
import { onValue, ref } from "firebase/database";
import MenuPage from '../../../menu';
import FooterPage from '../../../footer';

function ToDateTime (props) {
  console.log(props.dt);
  const date = new Date(props.dt * 1000);
  console.log(date.toLocaleDateString());
  return date.toLocaleDateString();
}

function ActDetail() {
  const params = useParams();
  const act_id = params.act_id;
  const usr_id = params.usr_id;

  const [actData, setActivities] = useState([]);
  const [locData, setLocation] = useState([]);

  useEffect(() => {
      const query = ref(db, "Activity/" + act_id);
      return onValue(query, (snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists()) {
          setActivities(data);
          setLocation(data.location);
        }
      });
  }, []);

  return (
      <>
        <MenuPage />
          <Container fluid>
          <h2 className='m-3'>
              <i className="bi bi-file-text"></i> รายละเอียดกิจกรรม
          </h2>
          <hr className='border border-primary' />
          <Row className="justify-content-md-center m-1 p-2">
            <Col>
          <Card style={{ width: '100%' }} className='bg-info-subtle'>
            <Card.Body>
              <Card.Title>{actData.title}</Card.Title>
              <hr />
              <Card.Subtitle className="mb-2 text-muted">
                <i className='bi bi-calendar-event'></i> วันที่: <ToDateTime dt={actData.dtStart} /><br />
                <i className='bi bi-geo-alt'></i> สถานที่: {locData.address}  (ละติจูด: {locData.latitude}, ลองจิจูด: {locData.longitude})
              </Card.Subtitle>
              <Card.Text>
                <Row>
                  <Col>
                    {actData.description}
                    <p>หมายเหตุ: {actData.note}</p>
                  </Col>
                  <Col className='justify-content-center mt-0'>
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 128, padding: "16px", background: "#FFFFFF", width: "100%" }}>
                      <QRCode 
                        value={`https://localhost:3000/checkin/${act_id}/${Cookies.get('userId')}/${locData.latitude}/${locData.longitude}`} 
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    </div>
                    <div className='d-flex justify-content-center m-3'>คุณสามารถสแกน QR Code หรือ กดปุ่มเพื่อเข้าร่วมกิจกรรมดังที่ปรากฏ</div>
                    <Card.Link href={`/checkin/${act_id}/${Cookies.get('userId')}/${locData.latitude}/${locData.longitude}`} className='m-3 btn btn-success d-grid col-7 mx-auto'>คลิกปุ่มเพื่อเข้าร่วมกิจกรรม (Check-in)</Card.Link>
                  </Col>
                </Row>
              </Card.Text>
            </Card.Body>
          </Card>
          </Col>
          </Row>
          <Link href="/activity" className='btn btn-secondary m-3'>
             <i className='bi bi-arrow-left-circle'></i> ย้อนกลับ
            </Link>
          </Container>
        <FooterPage />
      </>
  );
}

export default ActDetail;