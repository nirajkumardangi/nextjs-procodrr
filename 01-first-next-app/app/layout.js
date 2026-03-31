import "../public/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white p-4 text-center">
          <h1>My Next.js App</h1>
        </header>
        {children}
        <footer className="bg-gray-100 p-4 text-center mt-auto">
          <p>&copy; 2023 My App. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
