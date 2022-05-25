import { ResponsiveAppBar } from './responsive-app-bar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <ResponsiveAppBar />
        <main>{children}</main>
      </div>
    </>
  );
}
