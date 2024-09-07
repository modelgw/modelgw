'use client';
import Layout from '@/components/ui/Layout';
import { ApolloLink, HttpLink, gql } from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';
import { ApolloNextAppProvider, NextSSRApolloClient, NextSSRInMemoryCache, SSRMultipartLink } from '@apollo/experimental-nextjs-app-support/ssr';
import { cookies } from 'next/dist/client/components/headers';
import GatewayList from './gateways/GatewayList';
import UpdateGatewayForm from './gateways/[gatewayId]/UpdateGatewayForm';
import UpdateGatewayKeysForm from './gateways/[gatewayId]/UpdateGatewayKeysForm';
import InferenceEndpointForm from './inference-endpoints/InferenceEndpointForm';
import InferenceEndpointList from './inference-endpoints/InferenceEndpointList';
import InferenceEndpointTable from './inference-endpoints/import/InferenceEndpointTable';
import GatewayRequestTable from './traces/GatewayRequestTable';

// import { setVerbosity } from 'ts-invariant';
// setVerbosity('debug');


function makeClient() {
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(() => {
      const cookieStore = cookies();
      const token = cookieStore.get('token')?.value;
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
    });
    return forward(operation);
  });

  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    // uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? env('NEXT_PUBLIC_GRAPHQL_URL'),
    // uri: process.env.GRAPHQL_URL ?? env('NEXT_PUBLIC_GRAPHQL_URL'),
    uri: process.env.GRAPHQL_URL!,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: 'no-store' },
    credentials: 'include',
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  });

  return new NextSSRApolloClient({
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache({
      fragments: createFragmentRegistry(gql`
        ${Layout.fragments.viewer}
        ${GatewayList.fragments.gateways}
        ${GatewayRequestTable.fragments.gateways}
        ${GatewayRequestTable.fragments.gatewayRequests}
        ${UpdateGatewayForm.fragments.gateway}
        ${UpdateGatewayForm.fragments.inferenceEndpoints}
        ${UpdateGatewayKeysForm.fragments.gateway}
        ${UpdateGatewayKeysForm.fragments.gatewayKeys}
        ${InferenceEndpointList.fragments.inferenceEndpoints}
        ${InferenceEndpointForm.fragments.inferenceEndpoint}
        ${InferenceEndpointTable.fragments.azureModelDeployments}
      `),
    }),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
          authLink,
          // in a SSR environment, if you use multipart features like
          // @defer, you need to decide how to handle these.
          // This strips all interfaces with a `@defer` directive from your queries.
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
        : ApolloLink.from([
          // no authLink for client side
          httpLink,
        ]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
