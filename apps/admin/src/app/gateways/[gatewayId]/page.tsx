'use client';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@/components/ui/Tab';
import { toast } from '@/components/ui/Toast';
import { GatewayPageQuery, UpdateGatewayMutationFn, useGatewayPageSuspenseQuery, useUpdateGatewayMutation } from '@/generated/graphql-client';
import { GetDeepProp } from '@/lib/types';
import { gql } from '@apollo/client';
import { redirect } from 'next/navigation';
import UpdateGatewayForm from './UpdateGatewayForm';
import UpdateGatewayKeysForm from './UpdateGatewayKeysForm';


const GATEWAY_PAGE_QUERY = gql`
  query GatewayPage($gatewayId: ID!) {
    gateway: node(id: $gatewayId) {
      ... on Gateway {
        id
        name
        ...UpdateGatewayForm_gateway
        ...UpdateGatewayKeysForm_gateway
        keys {
          ...UpdateGatewayKeysForm_gatewayKeys
        }
      }
    }
    inferenceEndpoints {
      ...UpdateGatewayForm_inferenceEndpoints
    }
    viewer {
      ...Layout_viewer
    }
  }
`;

const UPDATE_GATEWAY = gql`
  mutation UpdateGateway($input: UpdateGatewayInput!) {
    updateGateway(input: $input) {
      gateway {
        id
        name
        ...UpdateGatewayForm_gateway
      }
    }
  }
`;

export default function UpdateGatewayPage({ params }: { params: { gatewayId: string } }) {
  const { data, refetch } = useGatewayPageSuspenseQuery({
    variables: { gatewayId: params.gatewayId }
  });
  const [updateGatewayMutation, { loading: updateGatewayLoading }] = useUpdateGatewayMutation();
  if (!data.viewer) return redirect('/login');

  type Gateway = Extract<GetDeepProp<GatewayPageQuery, 'gateway'>, { __typename?: 'Gateway' }>;
  const gateway = data.gateway as Gateway;

  const onSubmit: UpdateGatewayMutationFn = async (input) => {
    const result = await updateGatewayMutation(input);
    if (result.data?.updateGateway?.gateway) {
      toast('success', 'Gateway saved!');
      refetch();
    }
    return result;
  }

  return (
    <Layout viewer={data.viewer}>
      <SectionHeading title={gateway.name} className="mb-5" buttons={[{ content: 'Back', href: '/gateways' }]} />
      <TabGroup vertical>
        <TabList>
          <Tab>General</Tab>
          <Tab>API Keys</Tab>
        </TabList>
        <TabPanels className="pt-5">
          <TabPanel className="content p-5">
            <UpdateGatewayForm
              gateway={gateway}
              inferenceEndpoints={data.inferenceEndpoints!}
              loading={updateGatewayLoading}
              onSubmit={onSubmit}
            />
          </TabPanel>
          <TabPanel className="">
            <UpdateGatewayKeysForm
              gateway={gateway}
              gatewayKeys={gateway.keys!}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Layout>
  );
}
