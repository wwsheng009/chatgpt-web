## 使用axios实现打字机

服务器使用stream方式将数据写入前端。

在前端有两种方式实现打字机

使用fetch,浏览器直接支持使用fetch的方式调用后端stream接口。fetch回调函数每次接收**增量的文字数据**。

但经过测试证明，使用axios也能实现打字机模式，无需对后端作调整，需要注意的是，这不是最佳方法，但适用于前端项目改造的工作量较小，需要修改的代码也比较少。

使用axios实现打字机功能时，与fetch的sse模式不同，axios的回调函数每次都需要接收**全量的数据**，程序的处理逻辑只需要下载之前的所有文字写入缓存即可。


## Axios与Fetch的区别

## application/octet-stream与text/event-stream的区别。