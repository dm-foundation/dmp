import { Providers } from "./providers";
import Profile from "../components/profile";

export const metadata = {
  title: "wagmi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Profile />
          {children}
        </Providers>
      </body>
    </html>
  );
}
