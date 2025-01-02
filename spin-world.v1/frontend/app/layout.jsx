"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/reduxStore/store";
import TawkToWidget from "./components/TalkToWidget";
import AuthWrapper from "./components/authWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthWrapper>{children}</AuthWrapper>
        </Provider>
        <TawkToWidget />
      </body>
    </html>
  );
}
