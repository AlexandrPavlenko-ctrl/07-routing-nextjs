import React from "react";
import Providers from "../components/TanStackProvaider/TanStackProvaider";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import "./global.css";

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({
  children,
  modal,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Заглушка, яка каже браузеру не робити запит за іконкою і прибирає 404 помилку */}
        <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
      </head>
      <body>
        <Providers>
          <Header />
          <main
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              width: "100%",
              minHeight: 0,
            }}
          >
            {children}
          </main>
          <Footer />
          {modal}
        </Providers>
      </body>
    </html>
  );
}
