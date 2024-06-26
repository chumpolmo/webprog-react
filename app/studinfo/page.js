"use client"

// Import Firebase database
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { onValue, ref } from "firebase/database";

// For Navigation
import Link from 'next/link';

function Page() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const query = ref(db, "Users");
        return onValue(query, (snapshot) => {
          const data = snapshot.val();
    
          if (snapshot.exists()) {
            Object.values(data).map((user) => {
              setUsers((users) => [...users, user]);
            });
          }
        });
    }, []);

    // Display the result on the page
    return (
        <div>
            <h2>User Details</h2>
            {/* <pre>
                {JSON.stringify(users, '', 2)}
            </pre> */}
            {<div>
            {users.map((user) => (
            <p>
                {user.displayName}<br/>
                {user.email}<br/>
                {user.uid}<br/>
                {user.eduProfile.numOfAct}<br/>
            
            </p>
            ))}
            </div>}
            <Link href="/">Back</Link>
        </div>
    );
}

export default Page;