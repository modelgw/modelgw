import { Transform } from 'node:stream';
import { logger } from '../../lib/logger';


export class StreamCollectTransform extends Transform {

  private decoder = new TextDecoder('utf-8');
  /** Streaming buffer used to analyzed parts of the response */
  private buffer = '';
  /** Contains all content on flush */
  public content = '';
  public startTime: number;
  public firstTokenTime?: number;

  constructor() {
    super({ objectMode: true });
    this.startTime = performance.now();
  }

  _transform(chunk, _encoding, callback) {
    const decodedChunk = this.decoder.decode(chunk, { stream: true });
    logger.trace({ chunk: decodedChunk }, 'Got chunk from stream');

    // Convert chunk to string and add it to the buffer
    this.buffer += decodedChunk;

    // Split the buffer into lines
    const lines = this.buffer.split('\n');

    // Keep the last line in the buffer if it's incomplete
    this.buffer = lines.pop()!;

    // Process each non-empty line
    lines.filter(line => !!line).forEach(line => {
      if (!this.firstTokenTime) {
        this.firstTokenTime = performance.now();
      }
      line = line.replace(/^data: */, '').trim();
      if (line != '[DONE]') {
        this.content += line + '\n';
      }
    });

    callback(null, chunk);
  }

  async _flush(callback) {
    this.content = this.content.trim();
    callback();
  }

}
