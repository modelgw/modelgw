import gql from 'graphql-tag';
import { ServerContext, User } from '../server-context';
import { encodeGlobalId } from '../utils';


export const viewerTypeDefs = gql`
  extend type Query {
    viewer: Viewer
  }
  type Viewer {
    id: ID!
    email: String!
  }
`;

const resolve = async (_parent: any, _args: any, { user }: ServerContext, _info: any) => {
  if (user) {
    return { id: user.id, email: user.email };
  }
  return null;
};

export const viewerResolvers = {
  Query: {
    viewer: resolve,
  },
  Viewer: {
    id: (obj: User) => encodeGlobalId(obj.id, 'User'),
  }
};
