"use client"

import '../css/ccap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider } from 'react-cookie';
import MenuPage from './menu';
import FooterPage from './footer';
import SignInComponent from './sign-in.component';
import { useEffect } from 'react';

export default function HomePage() {
  return (
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <SignInComponent />
      </CookiesProvider>
  );
}
