export const CHAT_MESSAGES = [
  {
    id: '1',
    username: 'capapes',
    content: { text: 'Hey team 👋' },
    createdAt: '2026-03-18T10:00:00Z',
    isOwn: true,
  },
  {
    id: '2',
    username: 'cmanica-',
    content: { text: 'Hey! ready for the demo later?' },
    createdAt: '2026-03-18T10:01:00Z',
  },
  {
    id: '3',
    username: 'mfontser',
    content: {
      text: 'I just pushed the latest changes to the chat feature. Still missing socket integration though.',
    },
    createdAt: '2026-03-18T10:02:30Z',
  },
  {
    id: '4',
    username: 'capapes',
    content: {
      text: 'Nice 👍 I was reviewing the ScrollArea behavior, we might need auto-scroll on new message.',
    },
    createdAt: '2026-03-18T10:03:10Z',
    isOwn: true,
  },
  {
    id: '5',
    username: 'joanavar',
    content: {
      text: 'Yes, and also prevent jump when user scrolls up. Classic chat problem 😅',
    },
    createdAt: '2026-03-18T10:04:00Z',
  },
  {
    id: '6',
    username: 'cmanica-',
    content: {
      text: 'Are we handling message grouping? Like same user consecutive messages?',
    },
    createdAt: '2026-03-18T10:05:15Z',
  },
  {
    id: '7',
    username: 'capapes',
    content: {
      text: 'Not yet. I think that should be a derived UI concern, not backend.',
    },
    createdAt: '2026-03-18T10:06:00Z',
    isOwn: true,
  },
  {
    id: '8',
    username: 'mfontser',
    content: {
      text: 'Agree. Backend should stay dumb, just events + persistence.',
    },
    createdAt: '2026-03-18T10:06:45Z',
  },
  {
    id: '9',
    username: 'joanavar',
    content: {
      text: 'Also we need to think about rate limiting before exposing public API.',
    },
    createdAt: '2026-03-18T10:07:30Z',
  },
  {
    id: '10',
    username: 'capapes',
    content: {
      text: 'Yes, especially with bots / spam. Maybe Redis-based throttling later.',
    },
    createdAt: '2026-03-18T10:08:10Z',
    isOwn: true,
  },
  {
    id: '11',
    username: 'cmanica-',
    content: {
      text: 'For now, UI-wise, we should handle long messages too. This one is intentionally long to test wrapping behavior inside the message bubble component and ensure it does not break layout or overflow incorrectly.',
    },
    createdAt: '2026-03-18T10:09:00Z',
  },
  {
    id: '12',
    username: 'mfontser',
    content: {
      text: 'Good call. Also test maxLength + counter.',
    },
    createdAt: '2026-03-18T10:09:40Z',
  },
];
