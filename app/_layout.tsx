import { Slot } from 'expo-router';
import { SessionProvider } from "@/components/SessionContext"

export default function Layout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
