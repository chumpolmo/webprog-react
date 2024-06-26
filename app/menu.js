import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/ccap.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Cookies from "js-cookie";

export default function MenuPage() {
    return (
        <Navbar bg="primary" data-bs-theme="dark" className="ps-3">
            <Navbar.Brand href="/"><i class="bi bi-house-check-fill"></i> CCAP</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/">หน้าแรก</Nav.Link>
                <Nav.Link href="/about">เกี่ยวกับเรา</Nav.Link>
                {
                    Cookies.get('userLoggedIn') ? (
                    <>
                        <Nav.Link href="/activity">กิจกรรม</Nav.Link>
                        <Nav.Link href="/acthistory">ประวัติการเข้าร่วมกิจกรรม</Nav.Link>
                    </>
                    ) : (
                        <></>
                    )
                }
                <Nav.Link href="/contact">ติดต่อเรา</Nav.Link>
            </Nav>
            <Nav className="pe-3">
                {
                    Cookies.get('userLoggedIn') ? 
                    (<>
                        <Nav.Link href="/profile"><i class="bi bi-person-circle"></i> {Cookies.get('userEmail')} </Nav.Link>
                    </>) : ( <></> )
                }
                <Nav.Link href="/manual"><i class="bi bi-info-circle-fill"></i> คู่มือการใช้งาน</Nav.Link>
            </Nav>
        </Navbar>
    );
}
