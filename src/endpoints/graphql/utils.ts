import { GraphQLErrorExtensions } from 'graphql';
import { groupBy } from 'lodash';
import { ZodError } from 'zod';

export function encodeGlobalId(id: string, __typename: string) {
  return Buffer.from(`${id}:${__typename}`, 'utf8').toString('base64url');
}

export function decodeGlobalIdStr(objectId: string) {
  const decoded = Buffer.from(objectId, 'base64url').toString('utf8');
  const parts = decoded.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid ID');
  }
  return {
    id: parts[0],
    __typename: parts[1],
  };
}

export function decodeGlobalIdInt(objectId) {
  const id = decodeGlobalIdStr(objectId);
  return {
    id: parseInt(id.id),
    __typename: id.__typename,
  }
}

export type GraphQLValidationError = {
  field?: string,
  errors: Array<string>,
}

export interface GraphQLValidationErrorExtensions extends GraphQLErrorExtensions {
  code: 'INVALID_INPUT',
  validationErrors: Array<GraphQLValidationError>,
}

export function buildErrorObjectFromZodError(error: ZodError): Array<GraphQLValidationError> {
  if (error.issues.length) {
    const errorsGrouped = groupBy(error.issues, 'path');

    return Object.keys(errorsGrouped).reduce(
      (acc: GraphQLValidationError[], key) => [...acc, {
        field: key,
        errors: errorsGrouped[key].map((fieldError) => fieldError.message),
      }],
      [],
    );
  }

  return [{
    errors: [error.message],
  }];
}

