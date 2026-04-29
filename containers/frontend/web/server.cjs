const { createServer } = require('https');
const { readFileSync } = require('fs');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || '0.0.0.0';

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync(process.env.HTTPS_KEY_PATH || '/certs/localhost.key'),
  cert: readFileSync(process.env.HTTPS_CERT_PATH || '/certs/localhost.crt'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`Next.js HTTPS server running at https://${hostname}:${port}`);
  });
});
