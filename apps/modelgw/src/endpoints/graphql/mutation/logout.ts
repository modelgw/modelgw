import gql from 'graphql-tag';
import { ServerContext } from '../server-context';


export const logoutTypeDefs = gql`
  extend type Mutation {
    logout: Boolean
  }
`;

const resolve = async (
  _args: any,
  _input: any,
  { logger, res }: ServerContext,
): Promise<boolean> => {
  logger.info('User logged out');
  res.clearCookie('token');
  return true;
};

export const logoutResolvers = {
  Mutation: {
    logout: {
      resolve,
    }
  }
};
