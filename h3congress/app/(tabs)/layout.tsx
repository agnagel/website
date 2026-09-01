import TabNav from "../components/TabNav";
import SiteFooter from "../components/SiteFooter";

export default function TabsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h3-tabs-shell">
      <TabNav />
      <main id="h3-root">{children}</main>
      <SiteFooter />
    </div>
  );
}
