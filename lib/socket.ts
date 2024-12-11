import socketClient from 'socket.io-client';

let socket: SocketIOClient.Socket | null = null;

const useSocket = () => {
  const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_AUTH_URL

  if (!socket && socketServerUrl) {
    console.log('--- socket server url when initialized ---', socketServerUrl)
    socket = socketClient(socketServerUrl, {
      path: "/socket.io",
      secure: true,
    });
  } else {
    console.log('---no socket url---');
  }

  return { socket };
};
export default useSocket;
