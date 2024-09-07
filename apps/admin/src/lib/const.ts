

export type Authentication = {
  type: 'HTTP_BEARER_TOKEN';
} | {
  name: string;
  type: 'HTTP_HEADER';
  header: string;
} | {
  type: 'NONE';
};
export type Region = {
  value: string;
  name: string;
  country: string;
  flag: string;
};
export type Model = {
  name: string;
  version: string;
};
export type Platform = {
  name: string;
  value: string;
  defaultEndpoint?: string;
  authentication: Array<Authentication>;
  regions?: Array<Region>;
  models?: Array<Model>;
  deploymentName?: boolean;
};

export const PLATFORM_LIST: Array<Platform> = [{
  name: 'Azure OpenAI',
  value: 'AZURE_OPENAI',
  defaultEndpoint: 'https://<resource>.openai.azure.com',
  authentication: [{
    name: 'API Key',
    type: 'HTTP_HEADER',
    header: 'api-key',
  }],
  regions: [
    { value: 'australiaeast', name: 'Australia East', country: 'Australia', flag: 'au' },
    { value: 'canadaeast', name: 'Canada East', country: 'Canada', flag: 'ca' },
    { value: 'eastus', name: 'East US', country: 'United States', flag: 'us' },
    { value: 'eastus2', name: 'East US 2', country: 'United States', flag: 'us' },
    { value: 'francecentral', name: 'France Central', country: 'France', flag: 'fr' },
    { value: 'japaneast', name: 'Japan East', country: 'Japan', flag: 'jp' },
    { value: 'northcentralus', name: 'North Central US', country: 'United States', flag: 'us' },
    { value: 'norwayeast', name: 'Norway East', country: 'Norway', flag: 'no' },
    { value: 'southindia', name: 'South India', country: 'India', flag: 'in' },
    { value: 'swedencentral', name: 'Sweden Central', country: 'Sweden', flag: 'se' },
    { value: 'switzerlandnorth', name: 'Switzerland North', country: 'Switzerland', flag: 'ch' },
    { value: 'uksouth', name: 'UK South', country: 'United Kingdom', flag: 'gb' },
    { value: 'westeurope', name: 'West Europe', country: 'Netherland', flag: 'nl' },
    { value: 'westus', name: 'West US', country: 'United States', flag: 'us' },
  ],
  models: [
    { name: 'gpt-4o-mini', version: '2024-07-18' },
    { name: 'gpt-4o', version: '2024-08-06' },
    { name: 'gpt-4o', version: '2024-05-13' },
    { name: 'gpt-4', version: '0314' },
    { name: 'gpt-4-32k', version: '0314' },
    { name: 'gpt-4', version: '0613' },
    { name: 'gpt-4-32k', version: '0613' },
    { name: 'gpt-4', version: '1106-Preview' },
    { name: 'gpt-4', version: '0125-Preview' },
    { name: 'gpt-4', version: 'vision-preview' },
    { name: 'gpt-4', version: 'turbo-2024-04-09' },
    { name: 'gpt-35-turbo', version: '0301' },
    { name: 'gpt-35-turbo', version: '0613' },
    { name: 'gpt-35-turbo-16k', version: '0613' },
    { name: 'gpt-35-turbo-instruct', version: '0914' },
    { name: 'gpt-35-turbo', version: '1106' },
    { name: 'gpt-35-turbo', version: '0125' },
  ],
  deploymentName: true,
}, {
  name: 'Huggingface Inference Endpoints',
  value: 'HUGGINGFACE_INFERENCE_ENDPOINTS',
  defaultEndpoint: 'https://<instance>.<region>.<cloud>.endpoints.huggingface.cloud',
  authentication: [{
    type: 'HTTP_BEARER_TOKEN',
  }],
}, {
  name: 'Ollama',
  value: 'OLLAMA',
  authentication: [{
    type: 'NONE',
  }]
}, {
  name: 'OpenAI',
  value: 'OPENAI',
  defaultEndpoint: 'https://api.openai.com',
  authentication: [{
    type: 'HTTP_BEARER_TOKEN',
  }],
}, {
  name: 'Custom',
  value: 'CUSTOM',
  authentication: [{
    type: 'HTTP_BEARER_TOKEN',
  }],
}];
