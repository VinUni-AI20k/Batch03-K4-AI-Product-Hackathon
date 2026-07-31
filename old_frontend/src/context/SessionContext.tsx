import { createContext, ReactNode, useContext, useState } from "react";

type SessionState = {
  uploadedFileName: string;
  slideText: string;
  setUploadedFileName: (name: string) => void;
  setSlideText: (text: string) => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [slideText, setSlideText] = useState("");

  return (
    <SessionContext.Provider value={{ uploadedFileName, slideText, setUploadedFileName, setSlideText }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
