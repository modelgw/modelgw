import { CoreMessage } from '@assistant-ui/react';
import { ChatRequest } from 'ollama';

export function convertOllamaChatRequestToCoreMessages(ollamaReq: ChatRequest): CoreMessage[] | undefined {
  return ollamaReq.messages?.map<CoreMessage>((message) => {
    if (message.role === 'system') {
      return {
        role: 'system',
        content: [{ type: 'text', text: message.content }],
      };
    } else if (message.role === 'user') {
      return {
        role: 'user',
        content: [{ type: 'text', text: message.content }],
      };
    } else {
      return {
        role: 'assistant',
        content: [{ type: 'text', text: message.content }],
      };
    }
  });
}