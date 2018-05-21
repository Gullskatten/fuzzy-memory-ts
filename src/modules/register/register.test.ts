import { request } from "graphql-request";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";


const mutation = (email: string, password: string) => `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

beforeAll(async () => {
  await createTypeormConn();
});



describe("User registration", async () => {
  const aPassword = "jalksdf";

  test("Should throw an error on duplicate email registration.", async () => {
    const email = "tom@bob.com";

    const response = await request(process.env.TEST_HOST as string, mutation(email, aPassword));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(aPassword);

    const secondResponse: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, aPassword)
    );
    expect(secondResponse.register).toHaveLength(1);
    expect(secondResponse.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  test("Should throw validation errors when e-mail is too short and invalid format.", async () => {
    const invalidAndShortEmail = "1@";
    const response: any = await request(
      process.env.TEST_HOST as string,
      mutation(invalidAndShortEmail, aPassword)
    );
    expect(response.register).toHaveLength(2);

    expect(response).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        { path: "email", message: invalidEmail }
      ]
    });
  });
  test("Should throw an error if password is too short.", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      mutation("espen@espen.com", "e")
    );

    expect(response.register).toHaveLength(1);
    expect(response.register[0]).toEqual({
      path: "password",
      message: passwordNotLongEnough
    });
  });
});
