import App from "fusion-react";
import HelmetPlugin from "fusion-plugin-react-helmet-async";

import TodoAPI from "./todo-api";
import Root from "./todo";

export default async function start() {
  const app = new App(Root);
  app.register(HelmetPlugin);
  if (__NODE__) {
    app.middleware(TodoAPI);
  }
  return app;
}
