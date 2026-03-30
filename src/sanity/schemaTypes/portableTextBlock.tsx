import React from "react";

const Normal = ({ children }: { children?: React.ReactNode }) => (
  <p style={{ display: "block", width: "100%", margin: 0 }}>{children}</p>
);

const H2 = ({ children }: { children?: React.ReactNode }) => (
  <h2 style={{ display: "block", width: "100%", fontWeight: "bold", fontSize: "1.3em" }}>{children}</h2>
);

const H3 = ({ children }: { children?: React.ReactNode }) => (
  <h3 style={{ display: "block", width: "100%", fontWeight: "600", fontSize: "1.1em" }}>{children}</h3>
);

const H4 = ({ children }: { children?: React.ReactNode }) => (
  <h4 style={{ display: "block", width: "100%", fontWeight: "600", fontSize: "1em" }}>{children}</h4>
);

export const portableTextBlock = {
  type: "block" as const,
  styles: [
    { title: "Normal", value: "normal", component: Normal },
    { title: "Overskrift (stor)", value: "h2", component: H2 },
    { title: "Overskrift (liten)", value: "h3", component: H3 },
    { title: "Overskrift (mini)", value: "h4", component: H4 },
  ],
};
