import { request } from "graphql-request";

import { User } from "../../entity/User";
import { startServer } from "../../startServer";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "tom@bob.com";
const password = "jalksdf";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

test("Register user", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // Duplicate email should give an error.
  const secondResponse: any = await request(getHost(), mutation);
  expect(secondResponse.register).toHaveLength(1);
  expect(secondResponse.register[0].path).toEqual("email");
});
