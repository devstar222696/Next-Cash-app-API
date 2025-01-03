const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000','https://www.islandhouseonline.com', 'https://islandhouseonline.com','https://www.islandhousesweepstakes.com','https://main.d2nypjf0ihf8mb.amplifyapp.com', 'https://islandhousesweepstakes.com'], // Adjust this in production for security
    methods: ['GET', 'POST'],
  },
});

const PORT = parseInt(process.env.PORT || '3001', 10);
let connectedUsers = [];
const adminRoles = [
  'admin',
  'sub_admin'
]

io.on('connection', (socket) => {
  socket.on('register', ({ userId, role }) => {
    const userIndex = connectedUsers.findIndex((user) => user.userID === userId);
    if (userIndex < 0) {
      console.log('user connected: ', userId, role);
      connectedUsers.push({
        socketId: socket.id,
        userID: userId,
        role: role,
        socket
      });
    } else {
      connectedUsers[userIndex] = {
        socketId: socket.id,
        userID: userId,
        role: role,
        socket
      };
    }
  });

  socket.on('userRegister', ({ userId, message }) => {
    const recipient_admins = connectedUsers.filter(
      (user) => adminRoles.includes(user.role)
    );
    recipient_admins.forEach((recipient_admin) => {
      if (recipient_admin) {
        recipient_admin.socket.emit('receiveMessage', message);
        recipient_admin.socket.emit('newRegister', {userId});
      }
    });
  });

  socket.on('userDeposit', ({ userId, message }) => {
    const recipient_admins = connectedUsers.filter(
      (user) => adminRoles.includes(user.role)
    );
    recipient_admins.forEach((recipient_admin) => {
      if (recipient_admin) {
        recipient_admin.socket.emit('receiveMessage', message);
        recipient_admin.socket.emit('newDeposit', {userId});
      }
    });
  });
  
  socket.on('userWithdrawal', ({ userId, message }) => {
    const recipient_admins = connectedUsers.filter(
      (user) => adminRoles.includes(user.role)
    );
    recipient_admins.forEach((recipient_admin) => {
      if (recipient_admin) {
        recipient_admin.socket.emit('receiveMessage', message);
        recipient_admin.socket.emit('newWithdrawal', {userId});
      }
    });
  });

  socket.on('userVerify', ({ userId, message }) => {
    const recipient_admin = connectedUsers.find(
      (user) => (user.role === 'admin')
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

// Express route (optional)
app.get('/', (req, res) => {
  res.send('Socket.io Server is Running');
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});