



## `application/octet-stream` and `text/event-stream`

`application/octet-stream` and `text/event-stream` are two different MIME types used in HTTP (Hypertext Transfer Protocol).

`application/octet-stream` is a binary format used to send any type of data, including images, audio, video, and other types of files. It is often used when the actual format of the data is unknown or when the data is not meant to be displayed directly in a browser.

`text/event-stream` is a text-based format used for server-sent events (SSE). SSE is a technology that allows a web page to receive updates from a server in real-time. The server sends a stream of events to the client, and the client can then update the web page without having to refresh it. `text/event-stream` is used to define the format of the data that is sent from the server to the client in SSE.


axios在浏览器上并不支持SSE模式，因为它在浏览器上使用的是XMLHttpRequest。XMLHttpRequest没有stream模式的选项。

关于此问题的讨论：https://github.com/axios/axios/issues/479

相关文档：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType

