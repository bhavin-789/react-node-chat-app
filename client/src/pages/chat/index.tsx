import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const navigate = useNavigate();

  const { userInfo, selectedChatType } = useAppStore();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("PLease setup profile to coontinue.");
      navigate("/profile");
    } else {
      navigate("/chat");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />

      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
