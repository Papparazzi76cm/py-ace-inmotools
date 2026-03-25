import { createContext, useContext, ReactNode } from "react";
import { useTrial } from "@/hooks/useTrial";

type TrialContextType = ReturnType<typeof useTrial>;

const TrialContext = createContext<TrialContextType | null>(null);

export const useTrialContext = () => {
  const ctx = useContext(TrialContext);
  if (!ctx) throw new Error("useTrialContext must be used within TrialProvider");
  return ctx;
};

export function TrialProvider({ children }: { children: ReactNode }) {
  const trialData = useTrial();
  return (
    <TrialContext.Provider value={trialData}>
      {children}
    </TrialContext.Provider>
  );
}
