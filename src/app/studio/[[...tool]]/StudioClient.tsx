"use client";

import { NextStudio } from "next-sanity/studio/client-component";
import config from "@/sanity/config";
import Script from "next/script";

export default function StudioClient() {
  return (
    <>
      <Script
        src="https://core.sanity-cdn.com/bridge.js"
        strategy="afterInteractive"
        data-sanity-core=""
      />
      <NextStudio config={config} />
    </>
  );
}
