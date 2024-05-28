/** OpenAI like unauthorized response */
export const OpenAIUnauthorizedResponse = {
  error: {
    message: 'Incorrect Model Gateway API key provided',
    type: 'invalid_request_error',
    param: null,
    code: 'invalid_api_key'
  }
};
export const OpenAIUnauthorizedResponseStatus = 401;

export const GatewayNotConfiguredResponse = {
  error: {
    message: 'Gateway not configured properly',
    type: 'invalid_configuration_error',
    param: null,
    code: 'invalid_configuration_error'
  }
};
export const GatewayNotConfiguredStatus = 503;

export const GatewayExhaustedResponse = {
  error: {
    message: 'Gateway resources exhausted',
    type: 'resources_exhausted_error',
    param: null,
    code: 'resources_exhausted_error',
  }
};
export const GatewayExhaustedResponseStatus = 503;
