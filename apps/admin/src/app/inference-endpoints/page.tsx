'use client';
import EmptyState from '@/components/ui/EmptyState';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { useInferenceEndpointsPageSuspenseQuery } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { redirect } from 'next/navigation';
import InferenceEndpointList from './InferenceEndpointList';


const INFERENCE_ENDPOINTS_PAGE_QUERY = gql`
  query InferenceEndpointsPage {
    inferenceEndpoints {
      totalCount
      ...InferenceEndpointList_inferenceEndpoints
    }
    viewer {
      ...Layout_viewer
    }
  }
`;

const buttons = [
  {
    content: 'Import',
    href: '/inference-endpoints/import',
    primary: false,
  },
  {
    content: 'Create',
    href: '/inference-endpoints/create',
    primary: true,
  },
];

export default function InferenceEndpointsPage() {
  const { data } = useInferenceEndpointsPageSuspenseQuery();
  if (!data.viewer) return redirect('/login');

  return (
    <Layout viewer={data.viewer}>
      <SectionHeading title="Inference Endpoints" className="mb-5" buttons={buttons} />
      {data.inferenceEndpoints!.totalCount === 0 && <EmptyState title="Create a new Inference Endpoint" href="/inference-endpoints/create" />}
      {data.inferenceEndpoints!.totalCount > 0 && <InferenceEndpointList inferenceEndpoints={data.inferenceEndpoints!} />}
    </Layout>
  );
}
