import { setupWorker, rest } from "msw";
import { urls } from "../utils/constants";
import { stations } from "./tomtom_kyiv";

const worker = setupWorker(
  rest.get(urls.stations, (req, res, ctx) => res(ctx.delay(1000), ctx.json(stations))),
)

worker.start({onUnhandledRequest: "bypass"});