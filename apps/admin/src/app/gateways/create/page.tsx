'use client';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { toast } from '@/components/ui/Toast';
import { CreateGatewayMutationFn, useCreateGatewayMutation, useCreateGatewayPageSuspenseQuery } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { redirect, useRouter } from 'next/navigation';
import CreateGatewayForm from './CreateGatewayForm';

const CREATE_GATEWAY_PAGE_QUERY = gql`
  query CreateGatewayPage {
    viewer {
      ...Layout_viewer
    }
  }
`;

const CREATE_GATEWAY = gql`
  mutation CreateGateway($input: CreateGatewayInput!) {
    createGateway(input: $input) {
      gateway {
        id
      }
    }
  }
`;

export default function CreateGatewayPage() {
  const { data } = useCreateGatewayPageSuspenseQuery();
  const router = useRouter();
  const [createGatewayMutation, { loading: createGatewayLoading }] = useCreateGatewayMutation({
    // bug: https://github.com/apollographql/apollo-client/issues/9597
    refetchQueries: ['GatewaysPage'],
  });
  if (!data.viewer) return redirect('/login');

  const onSubmit: CreateGatewayMutationFn = async (input) => {
    const result = await createGatewayMutation(input);
    if (result.data?.createGateway?.gateway) {
      toast('success', 'Gateway created!');
      router.push(`/gateways/${result.data.createGateway.gateway.id}`);
    }
    return result;
  }

  return (
    <Layout>
      <SectionHeading title="Create Gateway" className="mb-5" buttons={[{ content: 'Back', href: '/gateways' }]} />
      <div className="space-y-10 divide-y divide-gray-900/10">
        <CreateGatewayForm onSubmit={onSubmit} loading={createGatewayLoading} />
      </div>
    </Layout>
  );
}
