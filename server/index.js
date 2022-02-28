// 创建一个WebSocket的服务器实例:
// 1.导入WebSocket模块:
const Ws = require('ws');

// 立即执行函数
; ((Ws) => {
  // 2.引用Server类，并且实例化
  // 建立一个websocket服务:实例化Ws里面的Server函数
  // 这里的port是8000（前端规定的端口）ws:localhost:5500
  // 我们就在8000端口上打开了一个WebSocket Server，该实例由变量server引用
  const server = new Ws.Server({ port: 8000 });

  const init = () => {
    bindEvent();
  }

  function bindEvent() {
    // 这里的on是node里监听事件，相当于前端里的addEventListener
    server.on('open', handleOpen);
    server.on('close', handleClose);
    server.on('error', handleError);
    server.on('connection', handleConnection);
  }

  function handleOpen() {
    console.log('websocket open');
  }

  function handleClose() {
    console.log('websocket close');
  }

  function handleError() {
    console.log('websocket error');
  }
  // 3.接下来，如果有WebSocket请求接入，ws对象可以响应connection事件来处理这个WebSocket：
  function handleConnection(ws) {
    console.log('websocket connected');

    ws.on('message', handleMessage);
  }

  // msg是接受前端发送来的信息
  function handleMessage(msg) {
    // console.log(msg);
    server.clients.forEach(function (c) {
      c.send(msg);
    })
  }

  init();

})(Ws);