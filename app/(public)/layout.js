import { getSettings } from "@/actions/settings";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default async function PublicLayout({ children }) {
  const settings = await getSettings();

  return (
    <>
      <Navbar companyName={settings.companyName} logo={settings.logo} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
