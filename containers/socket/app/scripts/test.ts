// TO TEST ON BROWSER

// First
const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.8.1/socket.io.min.js';
document.head.appendChild(script);

// Second
const socket = io('https://localhost:8443/chat', {
  path: '/socket.io',
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('connected', socket.id);
  socket.emit('chat:send', { text: 'hello from browser' });
});

socket.on('chat:message', (msg) => {
  console.log('message:', msg.content.text);
});

socket.on('connect_error', (err) => {
  console.error('connect_error:', err.message);
});

socket.on('chat:error', (err) => {
  console.error('chat:error:', err.code, err.details);
});

socket.on('chat:system', (msg) => {
  console.log('system message:', msg.type);
});

socket.emit('chat:send', {
  text: 'hello world',
});
