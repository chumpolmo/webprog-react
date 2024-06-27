'use client';

import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/ccap.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Cookies from "js-cookie";

export default function MenuPage() {
    let menuData = [
        {
            title: 'หน้าแรก',
            link: '/'
        },
        {
            title: 'เกี่ยวกับเรา',
            link: '/about'
        },
        {
            title: 'ติดต่อเรา',
            link: '/contact'
        },
        {
            title: 'คู่มือการใช้งาน',
            link: '/manual'
        }
    ];    
    const [menuText, setMenu] = useState(menuData); // Default text

    useEffect(() => {
        if(Cookies.get('userLoggedIn')){
            menuData = [
                {
                    title: 'หน้าแรก',
                    link: '/'
                },
                {
                    title: 'เกี่ยวกับเรา',
                    link: '/about'
                },
                {
                    title: 'กิจกรรม',
                    link: '/activity'
                },
                {
                    title: 'ประวัติการเข้าร่วมกิจกรรม',
                    link: '/acthistory'
                },
                {
                    title: 'ติดต่อเรา',
                    link: '/contact'
                },
                {
                    title: Cookies.get('userEmail'),
                    link: '/profile'
                },
                {
                    title: 'คู่มือการใช้งาน',
                    link: '/manual'
                }
            ];
            setMenu(menuData);
        }
    }, []);

    return (
        <Navbar expand="lg" bg="primary" data-bs-theme="dark" className="ps-3">
        <Navbar.Brand href="/"><i className="bi bi-house-check-fill"></i> CCAP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
                {menuText.map((menu, index) => (
                        <Nav.Link key={index} href={menu.link}>{menu.title}</Nav.Link>
                    ))}
                {/* <Nav.Link href={hrefUrl[1]}>{menuText[1]}</Nav.Link>
                {
                    Cookies.get('userLoggedIn') && (
                    <>
                        <Nav.Link href={hrefUrl[3]}>{menuText[3]}</Nav.Link>
                        <Nav.Link href={hrefUrl[4]}>{menuText[4]}</Nav.Link>
                    </>
                    )
                }
                <Nav.Link href={hrefUrl[2]}>{menuText[2]}</Nav.Link>
            </Nav>
            <Nav className="pe-3">
                {
                    Cookies.get('userLoggedIn') &&
                    (
                        <Nav.Link href={hrefUrl[6]}><i className="bi bi-person-circle"></i> {Cookies.get('userEmail')} </Nav.Link>
                    )
                }
                <Nav.Link href={hrefUrl[5]}><i className="bi bi-info-circle-fill"></i> {menuText[5]}</Nav.Link>
                 */}
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}
