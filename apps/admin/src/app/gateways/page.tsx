'use client';
import EmptyState from '@/components/ui/EmptyState';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { useGatewaysPageSuspenseQuery } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { redirect } from 'next/navigation';
import GatewayList from './GatewayList';


const GATEWAYS_PAGE_QUERY = gql`
  query GatewaysPage {
    gateways {
      totalCount
      ...GatewayList_gateways
    }
    viewer {
      ...Layout_viewer
    }
  }
`;

export default function GatewaysPage() {
  const { data } = useGatewaysPageSuspenseQuery();
  if (!data.viewer) return redirect('/login');

  return (
    <Layout viewer={data.viewer}>
      <SectionHeading title="Gateways" className="mb-5" buttons={[{ content: 'Create', href: '/gateways/create', primary: true }]} />
      {data.gateways!.totalCount === 0 && <EmptyState title="Create a new gateway" href="/gateways/create" />}
      {data.gateways!.totalCount > 0 && <GatewayList gateways={data.gateways!} />}
    </Layout>
  );
}
