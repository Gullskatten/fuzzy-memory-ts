import { request } from "graphql-request";

import { User } from "../../entity/User";
import { startServer } from "../../startServer";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const mutation = (email: string, password: string) => `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

test("Register user", async () => {
  const email = "tom@bob.com";
  const password = "jalksdf";

  const response = await request(getHost(), mutation(email, password));
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // Duplicate email should give an error.
  const secondResponse: any = await request(
    getHost(),
    mutation(email, password)
  );
  expect(secondResponse.register).toHaveLength(1);
  expect(secondResponse.register[0]).toEqual({
    path: "email",
    message: duplicateEmail
  });

  // Incorrect email should give an error.
  const email2 = "1@";
  const thirdResponse: any = await request(
    getHost(),
    mutation(email2, password)
  );
  expect(thirdResponse.register).toHaveLength(2);
  expect(thirdResponse.register[0]).toEqual({
    path: "email",
    message: emailNotLongEnough
  });

  expect(thirdResponse).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough
      },
      { path: "email", message: invalidEmail }
    ]
  });

   // Too short password should give an error.
   const fourthResponse: any = await request(
    getHost(),
    mutation("espen@espen.com", "e")
  );
  expect(fourthResponse.register).toHaveLength(1);
  expect(fourthResponse.register[0]).toEqual({
    path: "password",
    message: passwordNotLongEnough
  });
});
