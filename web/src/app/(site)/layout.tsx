import { Nav } from "@/components/layout/Nav";
import { StickyBar } from "@/components/layout/StickyBar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <StickyBar />
    </>
  );
}
