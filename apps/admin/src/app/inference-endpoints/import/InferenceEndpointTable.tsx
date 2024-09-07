import { InferenceEndpointTable_AzureModelDeploymentsFragment } from '@/generated/graphql-client';
import { gql } from '@apollo/client';
import { clsx } from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';


type Props = {
  azureModelDeployments: InferenceEndpointTable_AzureModelDeploymentsFragment[];
  selectedModelDeployments: InferenceEndpointTable_AzureModelDeploymentsFragment[];
  setSelectedModelDeployments: (selectedModelDeployments: InferenceEndpointTable_AzureModelDeploymentsFragment[]) => void;
}
export default function InferenceEndpointTable({ azureModelDeployments, selectedModelDeployments, setSelectedModelDeployments }: Props) {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useLayoutEffect(() => {
    const isIndeterminate = selectedModelDeployments.length > 0 && selectedModelDeployments.length < azureModelDeployments.length
    setChecked(selectedModelDeployments.length === azureModelDeployments.length)
    setIndeterminate(isIndeterminate)
    checkbox.current!.indeterminate = isIndeterminate
  }, [selectedModelDeployments]);

  const toggleAll = () => {
    setSelectedModelDeployments(checked || indeterminate ? [] : azureModelDeployments)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  };

  return (
    <table className="min-w-full table-fixed divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
            <input
              type="checkbox"
              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-indigo-600"
              ref={checkbox}
              checked={checked}
              onChange={toggleAll}
            />
          </th>
          <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold">
            Model deployment
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
            Account name
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
            Resource group
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
            Model
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
            Version
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-content">
        {azureModelDeployments.map((modelDeployment) => (
          <tr key={modelDeployment.id} className={selectedModelDeployments.includes(modelDeployment) ? 'bg-zinc-100 dark:bg-gray-700' : undefined}>
            <td className="relative px-7 sm:w-12 sm:px-6">
              {selectedModelDeployments.includes(modelDeployment) && (
                <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
              )}
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-indigo-600"
                value={modelDeployment.id}
                checked={selectedModelDeployments.includes(modelDeployment)}
                onChange={(e) =>
                  setSelectedModelDeployments(
                    e.target.checked
                      ? [...selectedModelDeployments, modelDeployment]
                      : selectedModelDeployments.filter((p) => p !== modelDeployment)
                  )
                }
              />
            </td>
            <td
              className={clsx(
                'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                selectedModelDeployments.includes(modelDeployment) ? 'text-primary' : 'text-content'
              )}
            >
              {modelDeployment.modelDeploymentName}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">{modelDeployment.accountName}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">{modelDeployment.resourceGroupName}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">{modelDeployment.modelDeploymentModelName}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">{modelDeployment.modelDeploymentModelVersion}</td>
          </tr>
        ))}
      </tbody>
    </table>

  )
}

InferenceEndpointTable.fragments = {
  azureModelDeployments: gql`
  fragment InferenceEndpointTable_azureModelDeployments on AzureModelDeployment {
      id
      subscriptionId
      resourceGroupName
      accountName
      accountLocation
      accountEndpoint
      modelDeploymentName
      modelDeploymentModelName
      modelDeploymentModelVersion
    }
  `
}
