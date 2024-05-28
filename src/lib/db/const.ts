// client and server usage

// Gateway
export const GatewayConst = {
  Status: {
    Active: 'ACTIVE' as const,
    Error: 'ERROR' as const,
    Throttling: 'THROTTLING' as const,
    Inactive: 'INACTIVE' as const,
  },
}

// Gateway Key
export const GatewayKeyConst = {
  Status: {
    Active: 'ACTIVE' as const,
    Revoked: 'REVOKED' as const,
  },
}

// Inference Endpoint
export const InferenceEndpointConst = {
  Status: {
    Active: 'ACTIVE' as const,
    Error: 'ERROR' as const,
    Throttling: 'THROTTLING' as const,
  },
  Platform: {
    AzureOpenAI: 'AZURE_OPENAI' as const,
    Custom: 'CUSTOM' as const,
    HuggingfaceInferenceEnpoints: 'HUGGINGFACE_INFERENCE_ENDPOINTS' as const,
    Ollama: 'OLLAMA' as const,
    OpenAI: 'OPENAI' as const,
  },
}
