import App from "fusion-react";
import React from "react";

export default async function start() {
  const root = <div>Hello World</div>;
  const app = new App(root);
  return app;
}
