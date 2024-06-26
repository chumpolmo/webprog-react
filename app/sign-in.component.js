// Thank: https://dev.to/canhamzacode/how-to-implement-google-authentication-with-firebase-and-reactjs-2o36
// Implementing Google Authentication
import '../css/ccap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Button, Image } from 'react-bootstrap';
import { db, auth, googleProvider } from '../config/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import { ref, set, child, get } from "firebase/database";
import { useCookies } from 'react-cookie'
import Link from 'next/link';
import MenuPage from './menu';
import FooterPage from './footer';

export default function SignInComponent() {
  // DB Configs
  let dbRef = ref(db);

  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState(null);

  // Cookies settings
  const [cookies, setCookie, removeCookie] = useCookies(['userLoggedIn','userId','userEmail']);

  const refreshPage = async () => {
    window.location.reload(true);
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // hook into Firebase Authentication
  useEffect(() => {
    if (auth) {
      let unsubscribe = onAuthStateChanged(auth, (user) => {
        // if user is null, then we force them to login
        console.log('onAuthStateChanged(): got user ', user);
        if (user) {
          setProfile(user);
          setCookie('userLoggedIn', true);
          setCookie('userId', user?.uid);
          setCookie('userEmail', user?.email);
        }
      });
      return unsubscribe;
    }
  }, [auth]);

  // listen to the user profile (FS User doc)
  useEffect(() => {
    let unsubscribe = null;
    const listenToUserDoc = async (uid) => {
      try {
        console.log('UserID:', uid);
        //let docRef = doc(myFS, 'Users', uid);
        get(child(dbRef, `Users/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let profileData = snapshot.val();
            console.log('Got user profile:', profileData, snapshot.val());
            setProfile(profileData);
          } else {
            console.log("No data available.");
          }
        }).catch((error) => {
          console.error(error);
        });
      } catch (ex) {
         console.error(
           `useEffect() calling onSnapshot() failed with: ${ex.message}`
         );
      }
    };

    if (user?.uid) {
      listenToUserDoc(user.uid);

      return () => {
        unsubscribe && unsubscribe();
      };
    } else if (!user) {
      // setAuthLoading(true);
      setProfile(null);
      // setAuthErrorMessages(null);
    }
  }, [user, setProfile]);

  // Logging out
  const handleLogout = async () => {
    if(window.confirm("กรุณายืนยันการออกจากระบบ?")) {
      // useEffect(() => {
        //try {
          // Push or Update Function
          let uid = user.uid;
          console.log('UserID: ', uid);
          let profData = {
            uid: uid,
            displayName: user.providerData[0].displayName,
            email: user.providerData[0].email,
            phoneNumber: user.providerData[0].phoneNumber,
            photoURL: user.providerData[0].photoURL,
            createdAt: Date.now()
          };
          await get(child(dbRef, `Users/${uid}`)).then((snapshot) => {
            if(snapshot.size === 1){
              update(ref(db, 'Users/' + uid), profData);
              console.log('Profile updated.');
            }else{
              set(ref(db, 'Users/' + uid), profData);
              console.log('Profile inserted.');
            }
          }).catch((error) => {
            console.error(error);
          });

          removeCookie('userLoggedIn');
          removeCookie('userId');
          removeCookie('userEmail');

          auth.signOut();
          refreshPage();
          //return true;
        //} catch(ex) {
        //  console.error(`Logout failed.`);
        //  return false;
        //};
      // }, []);
    }
  };

  // Displaying Authentication Status
  return (
    <>
      <MenuPage />
      <Container fluid>
        <div className='text-center m-5'>
        {
          user ? (
            <>
              <h2>ยินดีต้อนรับ คุณ {user?.displayName}</h2>
              <Image src={user?.photoURL} title={user?.photoURL} roundedCircle  className='m-3' /><br/>
              <Link href="/profile" className="link-underline link-underline-opacity-0"><i className="bi bi-person-fill"></i> โปรไฟล์</Link>
              <i className="bi bi-dot m-3"></i>
              <Link href="/changePasssword" className="link-underline link-underline-opacity-0"><i className="bi bi-key-fill"></i> เปลี่ยนรหัสผ่าน</Link><br/>
              <Button variant="warning" onClick={handleLogout} className='m-3'>ออกจากระบบ</Button>
            </>
          ) : (
            <>
              <h2 className='m-3'>
                <i class="bi bi-house-check-fill"></i> ระบบลงทะเบียนเข้าร่วมกิจกรรมพัฒนานักศึกษาวิทยาลัยชุมชน<br />
                (Community College Attendance Platforms: CCAP)
              </h2>
              <hr className='border border-primary' />
              <h3>กรุณาลงชื่อเข้าใช้งานด้วย Google Account ของท่าน</h3>
              <Button variant="primary" onClick={signInWithGoogle} className='m-3'>
                <i class="bi bi-box-arrow-in-right"></i> ลงชื่อเข้าใช้งานด้วย Google Account
              </Button>
            </>
          )
        }
        </div>
      </Container>
      <FooterPage />
    </>
  );
}