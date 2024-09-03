import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import { LoginInput, LoginPayload } from '../schema/generated/types';
import { ServerContext } from '../server-context';


export const loginTypeDefs = gql`
  extend type Mutation {
    login(input: LoginInput!): LoginPayload
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginPayload {
    token: String
  }
`;

export const LoginInputSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email'),
  password: z.string().trim().min(1, 'Password is required'),
});

const resolve = async (
  _args: any,
  { input }: { input: LoginInput },
  { logger, res }: ServerContext,
): Promise<LoginPayload> => {
  const values = await LoginInputSchema.parseAsync(input);

  if (process.env.ADMIN_EMAIL === values.email && process.env.ADMIN_PASSWORD === values.password) {
    logger.info({ email: values.email }, 'User logged in');
    const token = jwt.sign({ sub: 'ADMIN', email: values.email }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });
    return { token };
  }

  throw new ZodError([{ code: 'custom', path: ['password'], message: 'Invalid email or password' }]);
};

export const loginResolvers = {
  Mutation: {
    login: {
      resolve,
    }
  }
};
