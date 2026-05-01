import { GradingProvider } from "@/context/GradingContext";
import GradingCenterClient from "./GradingCenterClient";

export default function GradingPage() {
  return (
    <GradingProvider>
      <GradingCenterClient />
    </GradingProvider>
  );
}