const express = require("express");
const app = express();

app.use(
  express.static(".", {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    },
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`> ready on http://localhost:${port}`);
});
