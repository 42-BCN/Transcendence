# Real-time multiplayer chat architecture

## Definitions
 - Chats will exist per match
 - Auth handled by express during handshake
 - wss
 - FE (next) connects from client to Socket.io
 - Messages will be session only (v0)

## Socket.io events [domain:action]

| Event Name          | Direction |
|---------------------|-----------|
| `chat:send`         | Client → Server |
| `chat:message`      | Server → Clients |
| `chat:system`       | Server → Clients |
| `chat:error`        | Server → Client |
| `chat:rate_limited` | Server → Client |
| `chat:history`      | Server → Client |


## Message validation by Zod


``` ts
export const ChatSendSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "VALIDATION.REQUIRED")
    .max(300, "VALIDATION.MAX_CHAT_LEN"),
});

export const ChatMessageSchema = z.object({
  id: z.uiid(),
  matchId: z.uiid(),

  sender: z.object({
    id: z.uiid(),
    username: z.string(),
  }),

  content: z.object({
    text: z.string(),
  }),

  createdAt: z.number(),
});

export const ChatSystemMessageSchema = z.object({
  type: z.enum([
   // EVENTS (to define)
  ]),
  userId: z.uiid().optional(),
  matchId: z.uiid(),
  createdAt: z.number(),
});


export const ChatHistorySchema = z.object({
  messages: z.array(ChatMessageSchema),
});


```
## How to handle spam

- [ ] Check with the team rate limit. It's a nice to have so will be defined later.

### Common Technical Implementations (by Google search)
 - Rate Limiting: Discarding messages if a user sends more than a set amount (e.g., >10 messages/minute).
 - Cooldowns: Forcing a waiting period between messages.
 - Repetition Filtering: Detecting and blocking identical, consecutive messages.
 - Character Limits: Restricting the number of capital letters or total characters in a single message. 


## What happens if a player disconnects and reconnects
- Socket check the cookie with express again
- Receives recent chat history
- Server sends system messages on disconnect/connect


# Pending

- What happens on edge cases like player disconect too long? How game will continue?
- What happens if the server fails? how frontend fails gracefully?


