; ((doc, storage, location) => {

  const oUsername = doc.querySelector('#username');
  const oEnterBtn = doc.querySelector(".box2").querySelector("#enter");

  // 初始化函数
  const init = () => {
    // 绑定事件函数
    bindEvent();
  }

  // 绑定事件函数
  function bindEvent() {
    oEnterBtn.addEventListener('click', handleEnterBtnClick, false);
  }

  function handleEnterBtnClick() {
    const username = oUsername.value.trim();

    // 判断输入的用户名是否符合标准
    if (username.length < 6) {
      alert('用户名不小于6位');
      return;
    }
    // 用户名符合标准 则进入另一个页面
    storage.setItem('username', username);
    location.href = 'index.html';
  }

  init();

})(document, localStorage, location);