# Real-time multiplayer chat architecture

## Definitions

- Chats exist per match (one room per game)
- Auth handled by Express session cookie during Socket.IO handshake
- WSS (WebSocket Secure)
- Next.js frontend connects from client to Socket.IO
- Messages are session-only (in-memory, not persisted to DB)
- History is capped at **50 messages** per room

## Socket.IO events [domain:action]

| Event Name          | Direction           | Description |
|---------------------|---------------------|-------------|
| `chat:send`         | Client → Server     | Send a chat message |
| `chat:message`      | Server → Clients    | Broadcast a user message to room |
| `chat:system`       | Server → Clients    | System event (`USER_JOINED`, `USER_LEFT`) |
| `chat:error`        | Server → Client     | Validation error on a sent message |
| `chat:history`      | Server → Client     | Up to 50 recent messages on connect |
| `chat:identity`     | Server → Client     | Caller's identity info on connect |
| `chat:game-event`   | Server → Client     | Game events relayed through the chat namespace |

## Message schemas (from `contracts/sockets/chat/chat.schema.ts`)

```ts
// Client → Server
export const ChatSendSchema = z.object({
  text: z.string().trim().min(1).max(300).transform((val) => val.trim()),
});

// Server → Client: user message
export const ChatMessageSchema = BaseMessageSchema.extend({
  type: z.literal('user'),
  username: z.string(),
  content: z.object({ text: z.string() }),
});

// Server → Client: sender's own message echo (type 'me')
export const ChatMeSchema = BaseMessageSchema.extend({
  type: z.literal('me'),
  username: z.string(),
  content: z.object({ text: z.string() }),
});

// Server → Client: system event
export const ChatSystemMessageSchema = BaseMessageSchema.extend({
  type: z.literal('system'),
  content: z.object({
    text: z.enum(['USER_JOINED', 'USER_LEFT']),
  }),
});

// Server → Client: error
export const ChatErrorSchema = BaseMessageSchema.extend({
  type: z.literal('error'),
  content: z.object({ text: z.enum(['INVALID_CHAT_MESSAGE']) }),
});

// Server → Client: caller identity
export const ChatIdentitySchema = z.object({
  identityKey: z.string(),
  username: z.string(),
  isGuest: z.boolean(),
  userId: z.string().optional(),
});

// Union type (discriminated by `type`)
export const ChatMessageUnionSchema = z.discriminatedUnion('type', [
  ChatMessageSchema,
  ChatMeSchema,
  ChatSystemMessageSchema,
  ChatErrorSchema,
  ChatGameEventSchema,
]);

// History payload
export const ChatHistorySchema = z.array(ChatMessageUnionSchema);
```

## Disconnect / reconnect behavior

- Socket checks the session cookie with Express on reconnect
- Server sends the last 50 messages as `chat:history` on connect
- `USER_LEFT` system message is delayed by **800 ms** (`CHAT_LEFT_GRACE_MS`) after disconnect — if the same identity reconnects within that window, the leave event is suppressed (handles tab refreshes / brief network blips)
- Multi-tab: identity counts are tracked per room; `USER_JOINED` / `USER_LEFT` fire only when the count transitions through zero

## Spam handling

No server-side rate limiting is implemented on the chat namespace. The 300-character limit on `chat:send` is enforced via Zod validation; invalid payloads return `chat:error` with `INVALID_CHAT_MESSAGE`.
