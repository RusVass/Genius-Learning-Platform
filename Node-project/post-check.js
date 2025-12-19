const targets = [
  { url: "http://127.0.0.1:7000/api/admin", init: { method: "POST" } },
  { url: "http://127.0.0.1:7000/about", init: { method: "POST" } },
];

async function main() {
  for (const { url, init } of targets) {
    const res = await fetch(url, init);
    const body = await res.text();
    const method = init?.method ?? "GET";
    console.log(`${method} ${url} -> ${res.status} ${body.trim()}`);
  }
}

main().catch((error) => {
  console.error("Request failed:", error);
  process.exitCode = 1;
});

