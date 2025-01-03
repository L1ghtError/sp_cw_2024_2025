import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { type RouterContext } from "https://deno.land/x/oak@v17.1.4/router.ts";
const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello World!</title><head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>
  `;
});

// New compile/:filename endpoint
router.post("/compile/:filename", async (ctx: RouterContext) => {
  console.log(`${ctx.request.method} ${ctx.request.json()}`);

  let data
  // Check if 'source' field exists
  if (data && data.source) {
    ctx.response.body = { source: data.source };
  } else {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing 'source' field in body." };
  }
});


const app = new Application();
const port = 8000;

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server running on http://localhost:${port}`);

app.listen({ port: port });
