import "./globals.css";
import Nav from "./(components)/Nav";
import AuthProvider from "./(components)/AuthProvider";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-grey-100">
        <Nav />
        <AuthProvider>
          <div>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
