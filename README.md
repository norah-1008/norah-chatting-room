# websocket 由事件以及相应的响应和事件处理函数的执行来完成
这些事件要给websocket实例绑定
1. open 打开页面
2. close 关闭页面
3. error 错误
4. message 接收到消息要做什么
5. connection 已经连接到了

# 前端
1. open
2. close 关闭页面
3. error 错误
4. message 接收到消息要做什么

视图
1. entry.html - 
   Input username
   localStorage to save the username
   click for enter the chatting room
2. index.html
   list - show messages list
   input - message
   btn - send message

# 后端
1. open 打开页面
2. close 关闭页面
3. error 错误
4. message 接收到消息要做什么
5. connection 已经连接到了
message是connection里的一个事件。因为message事件要用到connection回调里面的一个参数去绑定事件处理函数

依赖ws包