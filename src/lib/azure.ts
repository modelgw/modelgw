import { TokenCredential } from '@azure/core-auth';
import { DefaultAzureCredential } from '@azure/identity';
import axios from 'axios';
import { logger } from './logger';


export type AzureModelDeployment = {
  id: string;
  subscriptionId: string;
  resourceGroupName: string;
  accountName: string;
  accountLocation: string;
  accountEndpoint: string;
  accountKey1: string;
  accountKey2: string;
  modelDeploymentName: string;
  modelDeploymentModelName: string;
  modelDeploymentModelVersion: string;
};

async function getAzureAccessToken(): Promise<string> {
  const credential: TokenCredential = new DefaultAzureCredential();
  const accessToken = await credential.getToken('https://management.azure.com/.default');
  if (!accessToken) {
    throw new Error('Failed to get access token');
  }
  return accessToken.token;
}

export async function getAllModelDeployments() {
  logger.info('Loading all model deployments from Azure');
  const token = await getAzureAccessToken();
  const api = axios.create({
    baseURL: 'https://management.azure.com',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    timeout: 10000,
  });

  const result: AzureModelDeployment[] = [];
  const subscriptions = await getAzureSubscriptions(api);
  await Promise.all(subscriptions.map(async (subscription) => {
    const resourceGroups = await getResouceGroups(subscription.subscriptionId, api);
    await Promise.all(resourceGroups.map(async (resourceGroup) => {
      const accounts = await getAIServicesAccounts(subscription.subscriptionId, resourceGroup.name, api);
      await Promise.all(accounts.map(async (account) => {
        const accountKeys = await getAccountKeys(subscription.subscriptionId, resourceGroup.name, account.name, api);
        const modelDeployments = await getModelDeployments(subscription.subscriptionId, resourceGroup.name, account.name, api);
        modelDeployments.forEach((modelDeployment) => {
          result.push({
            id: modelDeployment.id,
            subscriptionId: subscription.subscriptionId,
            resourceGroupName: resourceGroup.name,
            accountName: account.name,
            accountLocation: account.location,
            accountEndpoint: account.properties.endpoint,
            accountKey1: accountKeys.key1,
            accountKey2: accountKeys.key2,
            modelDeploymentName: modelDeployment.name,
            modelDeploymentModelName: modelDeployment.properties.model.name,
            modelDeploymentModelVersion: modelDeployment.properties.model.version,
          });
        });
      }));
    }));
  }));
  logger.info({ count: result.length }, 'Loaded all model deployments from Azure');
  return result;
}

async function getAzureSubscriptions(api: axios.AxiosInstance) {
  const response = await api.get('/subscriptions?api-version=2022-12-01');
  return response.data.value;
}

async function getResouceGroups(subscriptionId: string, api: axios.AxiosInstance) {
  const response = await api.get(`/subscriptions/${subscriptionId}/resourcegroups?api-version=2022-12-01`);
  return response.data.value;
}

async function getAIServicesAccounts(subscriptionId: string, resourceGroupName: string, api: axios.AxiosInstance) {
  const response = await api.get(`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.CognitiveServices/accounts?api-version=2023-05-01`);
  return response.data.value;
}

async function getAccountKeys(subscriptionId: string, resourceGroupName: string, aisAccountName: string, api: axios.AxiosInstance) {
  const response = await api.post(`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/${aisAccountName}/listKeys?api-version=2023-05-01`);
  return response.data;
}

async function getModelDeployments(subscriptionId: string, resourceGroupName: string, aisAccountName: string, api: axios.AxiosInstance) {
  const response = await api.get(`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/${aisAccountName}/deployments?api-version=2023-05-01`);
  return response.data.value;
}
