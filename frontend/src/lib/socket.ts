import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const SOCKET_URL = BASE_URL.replace(/\/api\/?$/, '');

export const socket = io(SOCKET_URL, {
  autoConnect: false, 
  withCredentials: true,
  transports: ['websocket'], 
});