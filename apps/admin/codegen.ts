import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'apps/modelgw/src/endpoints/graphql/schema/generated/graphql.schema.json',
  generates: {
    'apps/admin/src/generated/graphql-client.tsx': {
      documents: ['apps/admin/src/app/**/*.tsx', 'apps/admin/src/components/**/*.tsx'],
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo', 'fragment-matcher'],
      config: {
        scalars: { Date: Date, DateTime: Date, Object: Object },
        withHooks: true,
      },
    },
  },
};

export default config;
