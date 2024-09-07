'use client';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Layout from '@/components/ui/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { toast } from '@/components/ui/Toast';
import { InferenceEndpointTable_AzureModelDeploymentsFragment, useImportAzureInferenceEndpointsListQuery, useImportAzureInferenceEndpointsPageSuspenseQuery, useImportAzureModelDeploymentsMutation } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { kebabCase } from 'lodash';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import InferenceEndpointTable from './InferenceEndpointTable';


const IMPORT_AZURE_INFERENCE_ENDPOINTS_PAGE_QUERY = gql`
  query ImportAzureInferenceEndpointsPage {
    viewer {
      ...Layout_viewer
    }
  }
  query ImportAzureInferenceEndpointsList {
    azureModelDeployments {
      ...InferenceEndpointTable_azureModelDeployments
    }
  }
`;

const IMPORT_AZURE_MODEL_DEPLOYMENTS_MUTATION = gql`
  mutation ImportAzureModelDeployments($input: ImportAzureModelDeploymentsInput!) {
    importAzureModelDeployments(input: $input) {
      inferenceEndpoints {
        id
        name
      }
    }
  }
`;

export default function ImportInferenceEndpointsPage() {
  const { data } = useImportAzureInferenceEndpointsPageSuspenseQuery();
  const { data: listData, loading, error } = useImportAzureInferenceEndpointsListQuery({ ssr: false });
  const router = useRouter();
  const [importAzureModelDeployments, { loading: importing }] = useImportAzureModelDeploymentsMutation();
  const [selectedModelDeployments, setSelectedModelDeployments] = useState<InferenceEndpointTable_AzureModelDeploymentsFragment[]>([]);
  if (!data.viewer) return redirect('/login');

  const importModelDeployments = async () => {
    const modelDeployments = selectedModelDeployments.map((modelDeployment) => ({
      modelDeploymentId: modelDeployment.id,
      inferenceEndpointName: kebabCase(`${modelDeployment.accountName}-${modelDeployment.modelDeploymentName}`).substring(0, 63),
    }));
    const result = await importAzureModelDeployments({
      variables: { input: { modelDeployments } },
      refetchQueries: ['ImportAzureInferenceEndpointsList', 'InferenceEndpointsPage'],
    });
    if (result.data?.importAzureModelDeployments) {
      const count = result.data.importAzureModelDeployments.inferenceEndpoints.length;
      toast('success', `Imported ${count} inference endpoint${count === 1 ? '' : 's'}.`);
      router.push('/inference-endpoints');
    } else {
      toast('error', 'Failed to import inference endpoints.');
    }
  };

  return (
    <Layout viewer={data.viewer}>
      <SectionHeading title="Import Inference Endpoint from Azure" className="mb-5" buttons={[{ content: 'Back', href: '/inference-endpoints' }]} />

      {loading && <div className="content px-2 py-4 sm:px-4">
        <div>Loading...</div>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            {Array.from({ length: 5 }, (_, i) => (<div className="space-y-3" key={i}>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded col-span-1"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded col-span-1"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded col-span-1"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded col-span-1"></div>
              </div>
            </div>))}
          </div>
        </div>
      </div>}

      {!loading &&
        listData?.azureModelDeployments &&
        listData.azureModelDeployments.length === 0 && <EmptyState title="No new model deployments found" />}

      {!loading && listData?.azureModelDeployments && listData.azureModelDeployments.length > 0 && <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="content px-2 py-4 sm:px-4">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6">Model deployments in Azure</h1>
              <p className="mt-2 text-sm">
                A list of all model deployments available in your Azure subscriptions but not present in Model Gateway.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Button color="indigo" disabled={selectedModelDeployments.length === 0 || importing} onClick={importModelDeployments}>
                Import
              </Button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="relative">
                  <InferenceEndpointTable azureModelDeployments={listData.azureModelDeployments} selectedModelDeployments={selectedModelDeployments} setSelectedModelDeployments={setSelectedModelDeployments} />
                </div>
              </div>
            </div>
          </div>
        </div >
      </div>}

      {error && <div className="content p-4 gap-4">
        <p>Cannot load model deployments from Azure. Did you set up Azure credentials correctly in Model Gateway?</p>
      </div>}

    </Layout>
  );
}
