import http from "http";

const host = "127.0.0.1";
const port = 7000;

function notFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.end("Not Found\n");
}

function sendPlain(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain");
  res.end(`${body}\n`);
}

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "GET":
      switch (req.url) {
        case "/home":
          sendPlain(res, 200, "Home page");
          break;
        case "/about":
          sendPlain(res, 200, "About page");
          break;
        case "/api/admin":
          sendPlain(res, 200, "Read admin resource");
          break;
        default:
          notFound(res);
          break;
      }
      break;
    case "POST":
      switch (req.url) {
        case "/api/admin":
          sendPlain(res, 201, "Create admin resource");
          break;
        case "/about":
          sendPlain(res, 200, "About page");
          break;
        default:
          notFound(res);
          break;
      }
      break;
    case "PUT":
      switch (req.url) {
        case "/api/admin":
          sendPlain(res, 200, "Update admin resource");
          break;
        default:
          notFound(res);
          break;
      }
      break;
    case "PATCH":
      switch (req.url) {
        case "/api/admin":
          sendPlain(res, 200, "Patch admin resource");
          break;
        default:
          notFound(res);
          break;
      }
      break;
    case "DELETE":
      switch (req.url) {
        case "/api/admin":
          sendPlain(res, 200, "Delete admin resource");
          break;
        default:
          notFound(res);
          break;
      }
      break;
    default:
      notFound(res);
      break;
  }
});

server.listen(port, host, () => {
  console.log(`Server listening http://${host}:${port}`);
});

