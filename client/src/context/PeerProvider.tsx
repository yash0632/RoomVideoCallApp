import { createContext, useCallback, useContext, useState } from "react";

const PeerContext = createContext<{
  peer: RTCPeerConnection | null;
  connect: () => void;
} | null>(null);

export const usePeer = ()=>{
    const context = useContext(PeerContext);
    return context;
}


const PeerProvider = ({ children }: { children: React.ReactNode }) => {
  const [peer, setPeer] = useState<null | RTCPeerConnection>(null);
  const connect = useCallback(() => {
    const newPeer = new RTCPeerConnection();
    setPeer(newPeer);
  }, []);

  return (
    <PeerContext.Provider value={{ peer, connect }}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
