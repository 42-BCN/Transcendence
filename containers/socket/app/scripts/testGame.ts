// TO TEST ON BROWSER

// First
const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.8.1/socket.io.min.js';
document.head.appendChild(script);

// Second
const socket = io('http://localhost:3100/game', {
  path: '/socket.io',
  transports: ['websocket'],
});
socket.on('connect', () => {
  console.log('connected', socket);
});

socket.on('game:system', (msg) => {
  console.log('system message:', msg);
});

socket.emit('game:send', () => console.log('message sent'));

// socket.on('chat:message', (msg) => {
//   console.log('message:', msg.content.text);
// });
//
// socket.on('connect_error', (err) => {
//   console.error('connect_error:', err.message);
// });
//
// socket.on('chat:error', (err) => {
//   console.error('chat:error:', err.code, err.details);
// });
//

//// // TO TEST ON BROWSER
//
// // First
// const script = document.createElement('script');
// script.src = 'https://cdn.socket.io/4.8.1/socket.io.min.js';
// document.head.appendChild(script);
//
// // Second
// const socket = io('http://localhost:3100/game', {
//   path: '/socket.io',
//   transports: ['websocket'],
// });
//
// socket.on('message', (msg) => {
//   console.log('message:', msg);
// });
//
// socket.on('connect', () => {
//   console.log('connected', socket.name);
//   // socket.emit('chat:send', { text: 'hello from browser' });
// });
//
// // socket.on('chat:message', (msg) => {
// //   console.log('message:', msg.content.text);
// // });
// //
// // socket.on('connect_error', (err) => {
// //   console.error('connect_error:', err.message);
// // });
// //
// // socket.on('chat:error', (err) => {
// //   console.error('chat:error:', err.code, err.details);
// // });
// //
// // socket.on('chat:system', (msg) => {
// //   console.log('system message:', msg.type);
// // });
// //
// socket.emit('testEvent', {
// });
