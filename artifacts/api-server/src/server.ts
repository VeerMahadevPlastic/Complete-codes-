import { app } from './app';

const port = Number(process.env.PORT ?? 8080);

app.listen(port, () => {
  console.log(`VMP API server listening on :${port}`);
});
