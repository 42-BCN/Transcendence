import { ChatFeature } from '@/features/chat';
import { ChatProvider } from '@/features/chat/chat.provider';

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="shadow-lg m-5 rounded-xl w-[400px]">
        <ChatFeature isVisible={true} />
      </div>
    </ChatProvider>
  );
}
