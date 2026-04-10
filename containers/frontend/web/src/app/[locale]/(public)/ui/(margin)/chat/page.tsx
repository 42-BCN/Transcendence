import { ChatFeature } from '@/features/chat';
import { ChatProvider } from '@/features/chat/chat.provider';

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatFeature isVisible={true} />
    </ChatProvider>
  );
}
