import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore'

const firebase = initializeApp({
    apiKey: "AIzaSyA-0ZN4_0RV4t7-Z_BiPh1-Rh3Z5osZ0LY",
    authDomain: "hw-3-91667.firebaseapp.com",
    projectId: "hw-3-91667",
    storageBucket: "hw-3-91667.appspot.com",
    messagingSenderId: "234922876027",
    appId: "1:234922876027:web:508bc3d99d5d7ce74616de"
})
const firestore = getFirestore(firebase)

type Dat = {
    timestamp: number,
    coords: string
}

async function save(coords: string, setList: (_:Dat[]) => void) {
    const time = new Date().getTime()
    const doc_ = doc(firestore, `coords/${time}`)
    await setDoc(doc_, {
        timestamp: time,
        coords: coords
    })
    getList(setList)
}

async function getList(setList: (_:Dat[]) => void) {
    const collection_ = await collection(firestore, 'coords')
    let list: Dat[] = []
    const docs_ = await getDocs(collection_)
    for (const doc of docs_.docs) {
        const data = doc.data() as Dat
        list.push(data)
    }
    setList(list)
}

let full = ""

function App() {

    const [list, setList] = useState([] as Dat[])
    const [coords, setCoords] = useState('')

    navigator.geolocation.watchPosition((position) => {
        full = `Position(latitude=${position.coords.latitude},longitude=${position.coords.longitude},altitude=${position.coords.altitude})`
    });

    setInterval(() => setCoords(full), 500)

    return (
        <div>
            You're at {coords}
            <button onClick={() => save(full, setList)}>
                save coords
            </button>
            <ul>
                {list.map((dat) => <li>${dat.coords}@${dat.timestamp}</li>)}
            </ul>
        </div>
    );
}

export default App;
