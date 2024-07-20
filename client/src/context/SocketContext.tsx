import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";

const socketContext = createContext(null);

export const useSocket = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connected", () => {
        console.log("connected to socket server");
      });
        return () => { 
            socket.current.disconnect();
        }
    }
  }, [userInfo]);
    
    return (
        <socketContext.Provider value={socket.current}>
            {children}
        </socketContext.Provider>
    );
};
