import { ApolloError } from '@apollo/client';
import { UseFormSetError } from 'react-hook-form';
import { GraphQLValidationErrorExtensions } from './types';

export const invalidateForm = (setError: UseFormSetError<any>, fields?: string[]) => {
  return (error: ApolloError) => {
    if (error.graphQLErrors?.length > 0 && error.graphQLErrors[0].extensions?.code == 'INVALID_INPUT') {
      const extensions = error.graphQLErrors[0].extensions as unknown as GraphQLValidationErrorExtensions;
      extensions.validationErrors.forEach(validationError => {
        const field = validationError.field as any;
        if (fields === undefined || (fields && fields.includes(field))) {
          setError(field, { type: 'server', message: validationError.errors[0] });
        }
      });
    }
  };
};
