import { io } from "socket.io-client";


// create socket connection
const socket = io("http://localhost:5000", {
    autoConnect: false,
});


export default socket;