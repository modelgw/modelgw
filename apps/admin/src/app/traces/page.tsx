'use client';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { GatewayRequestFilter, useTracesListQuery, useTracesPageSuspenseQuery } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import GatewayRequestTable from './GatewayRequestTable';


const TRACES_PAGE_QUERY = gql`
  query TracesPage {
    viewer {
      ...Layout_viewer
    }
    gateways {
      ...GatewayRequestTable_gateways
    }
  }
  query TracesList($first: Int, $after: String, $filter: GatewayRequestFilter, $before: String, $last: Int) {
    gatewayRequests(first: $first, after: $after, before: $before, last: $last, filter: $filter) @connection(key: "gatewayRequests") {
      ...GatewayRequestTable_gatewayRequests
    }
  }
`;

export type FetchMore = ReturnType<typeof useTracesListQuery>['fetchMore'];

export default function TracesPage() {
  const defaultFilter: GatewayRequestFilter = {
    createdAt: {
      gte: dayjs(Date.now() - 60 * 60 * 1000).format('YYYY-MM-DDTHH:mm:ss'),
      lte: null,
    }
  };

  const { data } = useTracesPageSuspenseQuery();
  const { data: listData, loading, error, fetchMore, refetch } = useTracesListQuery({
    ssr: false, variables: { first: 50, filter: defaultFilter }
  });
  if (!data.viewer) return redirect('/login');

  const handleFetchMore = async () => {
    await fetchMore({
      variables: {
        after: listData?.gatewayRequests?.pageInfo.endCursor,
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        const newEdges = fetchMoreResult.gatewayRequests!.edges!;
        const pageInfo = fetchMoreResult.gatewayRequests!.pageInfo;

        return newEdges.length
          ? {
            // Put the new gatewayRequests at the end of the list and update `pageInfo` so we have the new `endCursor` and `hasNextPage` values
            gatewayRequests: {
              __typename: previousResult.gatewayRequests!.__typename,
              edges: [...previousResult.gatewayRequests!.edges!, ...newEdges],
              pageInfo
            }
          }
          : previousResult;
      },
    });
  };

  const handleFilter = async (filter: GatewayRequestFilter) => {
    await refetch({ filter });
  }

  return (
    <Layout viewer={data.viewer} fullWidth>
      <SectionHeading title="Traces" className="mb-5" buttons={[{ content: 'Back', href: '/' }]} />

      {loading && <div className="content px-2 py-4 sm:px-4">
        <div>Loading...</div>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            {Array.from({ length: 5 }, (_, i) => (<div className="space-y-3" key={i}>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded col-span-1"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded col-span-3"></div>
              </div>
            </div>))}
          </div>
        </div>
      </div>}

      {!loading && (
        <div className="content px-2 py-4 sm:px-0">
          <GatewayRequestTable
            gateways={data.gateways!}
            gatewayRequests={listData!.gatewayRequests!}
            defaultFilter={defaultFilter}
            fetchMore={handleFetchMore}
            filter={handleFilter}
          />
        </div>
      )}
    </Layout>
  );
}
