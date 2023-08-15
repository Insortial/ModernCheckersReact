import React, {useContext, useEffect, useState} from 'react'
import { io } from "socket.io-client";



const socket = io("https://api.example.com", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});


const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState()

    useEffect(() => {
        //const newSocket = io('https://renwell.dev/api');
        const newSocket = io('http://localhost:400/');
        setSocket(newSocket)
        return () => newSocket.close()
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
