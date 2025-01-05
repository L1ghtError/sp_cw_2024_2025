import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { type RouterContext } from "https://deno.land/x/oak@v17.1.4/router.ts";
import { v4 as uuidv4 } from "https://deno.land/std@0.215.0/uuid/mod.ts";
import { check_dir, clean_dir } from "./server_utils.ts";
const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = `
  <!DOCTYPE html>
<html>
<head>
	<title>Tornado!</title>
</head>
<body>
	<h1>Compilation service</h1>
	<p>Endpoints:</p>
	<ul>
		<li>/compile/:filename <p>Compiles and executes provided source</p></li>
		<li>/clean <p>Cleans working dir</p></li>
	</ul>
</body>
</html>
  `;
});

const default_compiler = "clang++";
const misc_dir = "./misc";
let res = await check_dir(misc_dir);
if (res != 0) {
  Deno.exit(res);
}

router.get("/clean", async (ctx) => {
  const cleanup_success = await clean_dir(misc_dir);

  if (!cleanup_success) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Cleanup failed" };
  } else {
    ctx.response.status = 200;
    ctx.response.body = { output: "Directory clean" };
  }
});

// New compile/:filename endpoint
router.post("/compile/:filename", async (ctx: any) => {
  let filepath = "";
  const file_ext = ".cpp";
  if (ctx.request.hasBody == true) {
    const body = await ctx.request.body.json();
    const source = body.source;

    const filename = ctx.params.filename;
    const uuid = crypto.randomUUID();
    const name = `${filename}_${uuid}`;
    //save
    filepath = `${misc_dir}/${name}`;
    const fout = `${filepath}${file_ext}`;
    await Deno.writeTextFile(fout, source);
  } else {
    ctx.response.status = 400;
    ctx.response.body = { error: "Request body is missing" };
    return;
  }
  // Compile the C++ source code
  const fout = `${filepath}${file_ext}`;
  const compileProcess = Deno.run({
    cmd: ["clang++", fout, "-o", `${filepath}.exe`],
    stdout: "piped",
    stderr: "piped",
  });

  const compileStatus = await compileProcess.status();
  const compileError = new TextDecoder().decode(
    await compileProcess.stderrOutput(),
  );

  compileProcess.close();

  if (!compileStatus.success) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Compilation failed", details: compileError };
    return;
  }
  // Execute the compiled binary
  const executeProcess = Deno.run({
    cmd: [`${filepath}.exe`],
    stdout: "piped",
    stderr: "piped",
  });

  const executeStatus = await executeProcess.status();
  const output = new TextDecoder().decode(await executeProcess.output());
  const execError = new TextDecoder().decode(
    await executeProcess.stderrOutput(),
  );

  executeProcess.close();

  if (!executeStatus.success) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Execution failed", details: execError };
  } else {
    ctx.response.status = 200;
    ctx.response.body = { output: output };
  }
});

const app = new Application();
const port = 8000;

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server running on http://localhost:${port}`);

app.listen({ port: port });
