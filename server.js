import * as build from "./index.js";

import express from "express";
import remix from "@remix-run/express";

const app = express();
const port = 3000;

app.all(
  "*",
  remix.createRequestHandler({
    build,
  })
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})