'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Profile() {
    const [flag, setFlag] = useState(true);
    const [data, setData] = useState([]);
    useEffect(() => {
      let json = { uid:'us1000', name:'Test Data' };
      const GetPost = async () => {
        if(flag === true)
        //    alert("Flag: "+flag);
        // const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        //   method: 'GET',
        //   headers: {
        //     "Content-Type": "application/json"
        //   }
        // })
        setData(json);
        setFlag(false);
      }
      GetPost()
    }, [data, flag]);

    return (
        <>
            <h1>Hello, your profile.</h1>
            <p>Flag: { flag ? 'true' : 'false' }</p>
            <pre>
                {JSON.stringify(data, '', 2)}
            </pre><br/>
            <Link href="/">Back</Link>
        </>
    );
}