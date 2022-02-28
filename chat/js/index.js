// // 上面的是形参（名字可以自起）
// ; ((doc, Socket, storage, location) => {
//   const oList = doc.querySelector('#list');
//   const oMsg = doc.querySelector('#message');
//   const oSendBtn = doc.querySelector('#send');
//   // 大部分浏览器都支持websocket
//   // 这里ws是协议 开给后端的开启服务的端口是3000
//   const ws = new Socket('ws:localhost:8000');
//   let username = '';

//   // 一个模块里面肯定要有一个init
//   const init = () => {
//     bindEvent();
//   }

//   // websocket 由事件以及相应的响应和事件处理函数的执行来完成
//   // 这些事件要给websocket实例绑定
//   function bindEvent() {
//     oSendBtn.addEventListener('click', handleSendBtnClick, false);
//     ws.addEventListener('open', handleOpen, false);
//     ws.addEventListener('close', handleClose, false);
//     ws.addEventListener('error', handleError, false);
//     ws.addEventListener('message', handleMessage, false);
//   }

//   function handleSendBtnClick() {
//     const msg = oMsg.value;

//     if (!msg.trim().length) {
//       return;
//     }
//     if (ws.readyState === 1) {           // 当前为只判断一次，可循环判断。

//       // ws.send(msg);
//       // 要传递回去的是字符串形式
//       ws.send(JSON.stringify({
//         user: username,
//         dataTime: new Date().getTime(),
//         message: msg
//       }));
//     }


//     oMsg.value = '';

//   }

//   function handleOpen(e) {
//     console.log('Websocket open', e);
//     username = storage.getItem('username');

//     if (!username) {
//       location.href = 'entry.html';
//       return;
//     }
//   }

//   function handleClose(e) {
//     console.log('Websocket close', e);
//   }

//   function handleError(e) {
//     console.log('Websocket error', e);
//   }

//   // 他会接受到从服务端传回来的消息 e是事件对象
//   // 在handleSendBtnClick发送，在handleMessage接收
//   function handleMessage(e) {
//     console.log('Websocket message');
//     // console.log(e);
//     const msgData = JSON.parse(e.data);
//     oList.appendChild(createMsg(msgData));
//   }

//   function createMsg(data) {
//     const { user, dataTime, message } = data;
//     const oItem = doc.createElement('li');
//     oItem.innerHTML = `
//       <p>
//         <span>${user}</span>
//         <i>${new DataTransfer(dataTime)}</i >
//       </p >
//       <p>消息：${message}</p>
//     `;
//     return oItem;
//   }

//   init();

// })(document, WebSocket, localStorage, location);
// // 下面括号里的是实参

// PS! Replace this with your own channel ID
// If you use this channel ID your app will stop working in the future
const CLIENT_ID = '1k9liUNplKQleGJG';

const drone = new ScaleDrone(CLIENT_ID, {
  data: { // Will be sent out as clientData via events
    name: getRandomName(),
    color: getRandomColor(),
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();
  });

  room.on('member_leave', ({ id }) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

drone.on('close', event => {
  console.log('Connection was closed', event);
});

drone.on('error', error => {
  console.error(error);
});

function getRandomName() {
  const adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
  const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
  return (
    adjs[Math.floor(Math.random() * adjs.length)] +
    "_" +
    nouns[Math.floor(Math.random() * nouns.length)]
  );
}

function getRandomColor() {
  // return '#' + Math.floor(0xFFFFFF).toString(16);
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

//------------- DOM STUFF

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  });
}

function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = '';
  // DOM.membersList.color = getRandomColor();
  // DOM.membersCount.getRandomColor = getRandomColor();
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}