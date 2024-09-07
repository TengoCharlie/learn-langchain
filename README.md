Here's a formatted example for streaming responses from LangChain to an API using NestJS and `ReadableStream`:

### 1. **Set Up the NestJS Controller**

```typescript
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('stream')
export class StreamController {
    @Get()
    async streamResponse(@Res() response: Response) {
        // Create a new ReadableStream
        const readableStream = new ReadableStream({
            start(controller) {
                // Assuming langChainFunction is your async function from LangChain
                langChainFunction().then(data => {
                    // Enqueue data and close the stream
                    controller.enqueue(data);
                    controller.close();
                }).catch(error => {
                    // Handle errors if any
                    controller.error(error);
                });

                // Example of how to push data continuously if needed
                // Implement your logic here if you need continuous streaming
                // setInterval or similar logic can be used
            },
        });

        // Set headers to specify streaming content type
        response.setHeader('Content-Type', 'text/event-stream');
        
        // Pipe the ReadableStream to the Express response object
        const writer = response.write.bind(response);
        const writableStream = new WritableStream({
            write(chunk) {
                writer(chunk);
            },
            close() {
                response.end();
            },
            abort(err) {
                response.destroy(err);
            }
        });

        // Start piping data from the readable stream to the writable stream
        readableStream.pipeTo(writableStream).catch(error => {
            // Handle piping errors if any
            console.error('Stream piping error:', error);
        });
    }
}
```

### 2. **LangChain Function**

Ensure that your `langChainFunction` returns data continuously or in chunks. Here is a simplified example of what it might look like:

```typescript
async function langChainFunction(): Promise<Uint8Array> {
    // This should return chunks of data or a stream
    // For demonstration, return a sample chunk
    return new Uint8Array([/* some data */]);
}
```

### 3. **Respond as Stream**

In the above code, the controller creates a `ReadableStream` and sets it up to pipe data to the Express response object. It handles the streaming response by setting the appropriate headers and writing data to the client as it arrives.

Make sure to handle errors properly and close the stream in a production environment. If you need continuous streaming, consider implementing logic to push data at regular intervals or based on some conditions.