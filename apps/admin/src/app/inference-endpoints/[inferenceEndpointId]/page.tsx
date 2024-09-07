'use client';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { toast } from '@/components/ui/Toast';
import { InferenceEndpointPageQuery, UpdateInferenceEndpointMutationFn, useInferenceEndpointPageSuspenseQuery, useUpdateInferenceEndpointMutation } from '@/generated/graphql-client';
import { GetDeepProp } from '@/lib/types';
import { gql } from '@apollo/client';
import { redirect } from 'next/navigation';
import InferenceEndpointForm from '../InferenceEndpointForm';


const INFERENCE_ENDPOINT_PAGE_QUERY = gql`
  query InferenceEndpointPage($inferenceEndpointId: ID!) {
    inferenceEndpoint: node(id: $inferenceEndpointId) {
      ... on InferenceEndpoint {
        id
        name
        ...InferenceEndpointForm_inferenceEndpoint
      }
    }
    viewer {
      ...Layout_viewer
    }
  }
`;

const UPDATE_INFERENCE_ENDPOINT = gql`
  mutation UpdateInferenceEndpoint($input: UpdateInferenceEndpointInput!) {
    updateInferenceEndpoint(input: $input) {
      inferenceEndpoint {
        id
        name
        ...InferenceEndpointForm_inferenceEndpoint
      }
    }
  }
`;

export default function UpdateInferenceEndpointPage({ params }: { params: { inferenceEndpointId: string } }) {
  const { data, refetch } = useInferenceEndpointPageSuspenseQuery({
    variables: { inferenceEndpointId: params.inferenceEndpointId }
  });
  const [updateInferenceEndpointMutation, { loading: updateInferenceEndpointLoading }] = useUpdateInferenceEndpointMutation();
  if (!data.viewer) return redirect('/login');

  type InferenceEndpoint = Extract<GetDeepProp<InferenceEndpointPageQuery, 'inferenceEndpoint'>, { __typename?: 'InferenceEndpoint' }>;
  const inferenceEndpoint = data.inferenceEndpoint as InferenceEndpoint;

  const onSubmit: UpdateInferenceEndpointMutationFn = async (input) => {
    const result = await updateInferenceEndpointMutation(input);
    if (result.data?.updateInferenceEndpoint?.inferenceEndpoint) {
      toast('success', 'Inference endpoint saved!');
      refetch();
    }
    return result;
  }

  return (
    <Layout viewer={data.viewer}>
      <SectionHeading title={inferenceEndpoint.name} className="mb-5" buttons={[{ content: 'Back', href: '/inference-endpoints' }]} />
      <div className="space-y-10 divide-y divide-gray-900/10">
        <InferenceEndpointForm inferenceEndpoint={inferenceEndpoint} loading={updateInferenceEndpointLoading} onSubmit={onSubmit} />
      </div>
    </Layout>
  );
}
