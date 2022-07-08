import React, {useEffect, useState} from 'react';
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

async function save(coords: string, setList: (_:Dat[]) => void, list: Dat[]) {
    const time = new Date().getTime()
    const doc_ = doc(firestore, `coords/${time}`)
    const newl = [...list]
    newl.push({
        timestamp: time,
        coords: coords
    })
    setList(newl)
    await setDoc(doc_, {
        timestamp: time,
        coords: coords
    })
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

function round(num: number) {
    return Math.floor(num * 100) / 100
}

let coords_ = [0, 0, 0, 0]
let err = ""

function arrts(arr: Array<any>) {
    let str = "["
    str += arr.toString().replaceAll(",", ", ")
    str += "]"
    return str
}

function App() {

    const [list, setList] = useState([] as Dat[])
    const [display, setDisplay] = useState(<div/>)

    useEffect(() => {
        getList(setList)
    }, [])

    setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            coords_[0] = (position.coords.latitude)
            coords_[1] = (position.coords.longitude)
            coords_[2] = (position.coords.altitude === null ? 0 : position.coords.altitude)
            coords_[3] = new Date().getTime()
            err = ""
        }, (err1) => {
            err = err1.message
        })
    }, 100)

    setInterval(() => {
        if (err === "") {
            setDisplay(<ul>
                <li>latitude: {coords_[0]}</li>
                <li>longitude: {coords_[1]}</li>
                <li>altitude: {coords_[2]}</li>
                <li>time: {coords_[3]}</li>
            </ul>)
        } else {
            setDisplay(<div className={"color:red"}>{err}</div>)
        }
    }, 500)

    return (
        <div>
            You're at {display}
            <button onClick={() => save(arrts(coords_), setList, list)}>
                Save location
            </button>
            <div className={"max"}>
                <ul>
                    {list.map((dat) => <li>{dat.coords}@{dat.timestamp}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default App;
