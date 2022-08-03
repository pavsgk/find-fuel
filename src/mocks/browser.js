import { setupWorker, rest } from "msw";
import stations from "./stations";

const worker = setupWorker(
  rest.get('/api/stations', (req, res, ctx) => res(ctx.json(stations))),
)

worker.start({onUnhandledRequest: "bypass"});