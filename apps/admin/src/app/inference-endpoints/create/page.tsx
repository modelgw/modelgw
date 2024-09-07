'use client';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { toast } from '@/components/ui/Toast';
import { CreateInferenceEndpointMutationFn, useCreateInferenceEndpointMutation, useCreateInferenceEndpointPageSuspenseQuery } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { redirect, useRouter } from 'next/navigation';
import InferenceEndpointForm from '../InferenceEndpointForm';


const CREATE_INFERENCE_ENDPOINT_PAGE_QUERY = gql`
  query CreateInferenceEndpointPage {
    viewer {
      ...Layout_viewer
    }
  }
`;

const CREATE_INFERENCE_ENDPOINT = gql`
  mutation CreateInferenceEndpoint($input: CreateInferenceEndpointInput!) {
    createInferenceEndpoint(input: $input) {
      inferenceEndpoint {
        id
      }
    }
  }
`;

export default function CreateInferenceEndpointPage() {
  const { data } = useCreateInferenceEndpointPageSuspenseQuery();
  const router = useRouter()
  const [createInferenceEndpointMutation, { loading: createInferenceEndpointLoading, client }] = useCreateInferenceEndpointMutation({
    // bug: https://github.com/apollographql/apollo-client/issues/9597
    refetchQueries: ['InferenceEndpointsPage'],
  });
  if (!data.viewer) return redirect('/login');

  const onSubmit: CreateInferenceEndpointMutationFn = async (input) => {
    const result = await createInferenceEndpointMutation(input);
    if (result.data?.createInferenceEndpoint?.inferenceEndpoint) {
      toast('success', 'Inference endpoint created!');
      router.push(`/inference-endpoints/${result.data.createInferenceEndpoint.inferenceEndpoint.id}`);
    }
    return result;
  }

  return (
    <Layout viewer={data.viewer}>
      <SectionHeading title="Create Inference Endpoint" className="mb-5" buttons={[{ content: 'Back', href: '/inference-endpoints' }]} />
      <div className="space-y-10 divide-y divide-gray-900/10">
        <InferenceEndpointForm onSubmit={onSubmit} loading={createInferenceEndpointLoading} />
      </div>
    </Layout>
  );
}
