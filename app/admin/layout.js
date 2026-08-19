import { SessionProvider } from "@/components/session-provider";

export const metadata = {
  title: {
    default: "Panel administrativo",
    template: "%s | Panel viziontech",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
