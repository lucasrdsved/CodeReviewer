import ChatInterface from '../ChatInterface';

export default function ChatInterfaceExample() {
  //todo: remove mock functionality 
  const mockOtherUser = {
    name: "Lucas",
    avatar: undefined,
    status: 'online' as const
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <ChatInterface 
        currentUser="student"
        otherUser={mockOtherUser}
      />
    </div>
  );
}