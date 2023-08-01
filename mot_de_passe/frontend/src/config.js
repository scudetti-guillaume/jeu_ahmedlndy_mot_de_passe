import axios from 'axios';
import { io } from 'socket.io-client';



const axiosBase = axios.create({
    // baseURL: '/mdp/backend'
    baseURL: 'http://localhost:4000'
});

// const socket = io('https://lesiteduscudo.com', { path: "/mdp/backend" },
// { cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
//     credentials: true,
// }
// },
//     {transports: ['websocket',
//     'flashsocket',
//     'htmlfile',
//     'xhr-polling',
//     'jsonp-polling',
//     'polling'],
//     allowEIO3: true,
//     serveClient: true, }
//     );
    
    
const socket = io('http://localhost:4000',
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
            credentials: true,
        }
    },
    {
        transports: ['websocket',
            'flashsocket',
            'htmlfile',
            'xhr-polling',
            'jsonp-polling',
            'polling'],
        allowEIO3: true,
        serveClient: true,
    }
);

    
// const playerNamespace = io('https://lesiteduscudo.com', {
//     path: "/mdp/backend/player",
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
//         credentials: true,
//     },
//     transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
//     allowEIO3: true,
//     serveClient: true,
// });


// const teamNamespace = io('https://lesiteduscudo.com', {
//     path: "/mdp/backend/team",
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
//         credentials: true,
//     },
//     transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
//     allowEIO3: true,
//     serveClient: true,
// });

// const gameMasterNamespace = io('https://lesiteduscudo.com', {
//     path: "/mdp/backend/gamemaster",
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
//         credentials: true,
//     },
//     transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
//     allowEIO3: true,
//     serveClient: true,
// });

// const endGameNamespace = io('https://lesiteduscudo.com', {
//     path: "/mdp/backend/endgame",
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
//         credentials: true,
//     },
//     transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
//     allowEIO3: true,
//     serveClient: true,
// });




export { axiosBase, socket };