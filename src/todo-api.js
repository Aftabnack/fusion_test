const todos = ["Buy milk", "Walk dog"];

export default async (ctx, next) => {
  if (ctx.path === "/api/todos") {
    if (ctx.method === "GET") {
      ctx.response.body = todos;
    }
  }
  await next();
};
