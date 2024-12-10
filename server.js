// server.js
const { createServer } = require('http');
const next = require('next');
const { parse } = require('node:url');
const { Server } = require('socket.io');

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let connectedUsers = [];

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('register', ({ userId, role }) => {
      connectedUsers.push({
        socketId: socket.id,
        userID: userId,
        role: role,
        socket
      });
    });

    socket.on('userRegister', ({ userId, message }) => {
      const recipient_admin = connectedUsers.find(
        (user) => user.role === 'admin'
      );
      if (recipient_admin) {
        recipient_admin.socket.emit('receiveMessage', message);
      }
    });

    socket.on('userVerify', ({ userId, message }) => {
      const recipient_admin = connectedUsers.find(
        (user) => user.role === 'admin'
      );
      if (recipient_admin) {
        recipient_admin.socket.emit('receiveMessage', message);
      }
    });

    socket.on('adminRegister', (data) => {
      const recipient = connectedUsers.find(
        (user) => user.userID === data.receiveuserId
      );
      if (recipient) {
        recipient.socket.emit('receiveMessage', data.message);
      }
    });

    socket.on('adminLoginId', (data) => {
      const recipient = connectedUsers.find(
        (user) => user.userID === data.receiveuserId
      );
      if (recipient) {
        recipient.socket.emit('receiveMessage', data.message);
      }
    });

    socket.on('adminPasswordCode', (data) => {
      const recipient = connectedUsers.find(
        (user) => user.userID === data.receiveuserId
      );
      if (recipient) {
        recipient.socket.emit('receiveMessage', data.message);
      }
    });

    socket.on('registerRequest', (data) => {
      socket.emit('registerRecieve', data);
    });

    socket.on('verifyRequest', (data) => {
      socket.emit('verifyRecieve', data);
    });

    socket.on('depositRequest', (data) => {
      socket.emit('depositRecieve', data);
    });

    socket.on('withdrawalRequest', (data) => {
      socket.emit('withdrawalRecieve', data);
    });

    socket.on('selectAllIds', (data) => {
      socket.emit('selectMultiIds', data);
    });

    socket.on('selectIds', (data) => {
      socket.emit('selectMultiId', data);
    });

    socket.on('selectHistoryAllIds', (data) => {
      socket.emit('selectHistoryMultiIds', data);
    });

    socket.on('selectHistoryIds', (data) => {
      socket.emit('selectHistoryMultiId', data);
    });

    socket.on('selectWithdrawalAllIds', (data) => {
      socket.emit('selectWithdrawalMultiIds', data);
    });

    socket.on('selectWithdrawalIds', (data) => {
      socket.emit('selectWithdrawalMultiId', data);
    });

    socket.on('selectWithdrawalHistoryAllIds', (data) => {
      socket.emit('selectWithdrawalHistoryMultiIds', data);
    });

    socket.on('selectWithdrawalHistoryIds', (data) => {
      socket.emit('selectWithdrawalHistoryMultiId', data);
    });

    socket.on('selectCodeVerifyAllIds', (data) => {
      socket.emit('selectCodeVerifyMultiIds', data);
    });

    socket.on('selectCodeVerifyIds', (data) => {
      socket.emit('selectCodeVerifyMultiId', data);
    });

    socket.on('selectRegisterAllIds', (data) => {
      socket.emit('selectRegisterMultiIds', data);
    });

    socket.on('selectRegisterIds', (data) => {
      socket.emit('selectRegisterMultiId', data);
    });

    socket.on('disconnect', () => {
      connectedUsers = connectedUsers.filter(
        (item) => item.socketId != socket.id
      );
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Running on port: ${port}`);
  });
});
