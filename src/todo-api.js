const todos = ["Buy milk", "Walk dog"];

export default async (ctx, next) => {
  if (ctx.path === "/api/todos") {
    if (ctx.method === "GET") {
      ctx.response.body = todos;
    } else if (ctx.method === "POST") {
      const { value } = ctx.request.body;
      todos.push(value);
      ctx.response.status = 201;
    }
  }
  await next();
};
