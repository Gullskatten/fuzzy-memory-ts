import { startServer } from "../startServer";
import { AddressInfo } from "net";

export const setup = async () => {
  const app = await startServer();

  const address = app.address();

  if ((<AddressInfo>address).port) {
    process.env.TEST_HOST = `http://127.0.0.1:${(<AddressInfo>address).port}`;
  } else {
    process.env.TEST_HOST = "http://127.0.0.1:4000";
  }
};
