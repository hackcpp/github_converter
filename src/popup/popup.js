function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = isError ? 'red' : 'green';
  setTimeout(() => status.textContent = '', 3000);
}

function disableButton(buttonId) {
  const button = document.getElementById(buttonId);
  button.disabled = true;
  button.style.opacity = '0.5';
  button.style.cursor = 'not-allowed';
}

// 页面加载时检查当前URL并禁用相应按钮
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  const url = tabs[0]?.url;
  if (!url) return;

  const hostname = new URL(url).hostname;
  if (hostname === 'github.com') {
    disableButton('github-btn');
  } else if (hostname.includes('github1s.com')) {
    disableButton('github1s-btn');
  } else if (hostname.includes('codewiki.google')) {
    disableButton('codewiki-btn');
  } else {
    // 其他页面禁用所有按钮
    disableButton('github-btn');
    disableButton('github1s-btn');
    disableButton('codewiki-btn');
  }
});

document.getElementById('codewiki-btn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.runtime.sendMessage({
      action: 'convertToCodeWiki',
      url: tabs[0].url
    }, (response) => {
      if (chrome.runtime.lastError || !response?.success) {
        showStatus('转换失败: ' + (response?.error || chrome.runtime.lastError?.message), true);
      } else {
        showStatus('正在跳转到CodeWiki...');
        window.close();
      }
    });
  });
});

document.getElementById('github1s-btn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.runtime.sendMessage({
      action: 'convertToGitHub1s',
      url: tabs[0].url
    }, (response) => {
      if (chrome.runtime.lastError || !response?.success) {
        showStatus('转换失败: ' + (response?.error || chrome.runtime.lastError?.message), true);
      } else {
        showStatus('正在跳转到GitHub1s...');
        window.close();
      }
    });
  });
});

document.getElementById('github-btn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.runtime.sendMessage({
      action: 'convertToGitHub',
      url: tabs[0].url
    }, (response) => {
      if (chrome.runtime.lastError || !response?.success) {
        showStatus('转换失败: ' + (response?.error || chrome.runtime.lastError?.message), true);
      } else {
        showStatus('正在跳转到GitHub...');
        window.close();
      }
    });
  });
});

// 添加键盘快捷键支持
document.addEventListener('keydown', (event) => {
  // 防止在输入框中触发快捷键
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return;
  }

  const key = event.key.toLowerCase();
  
  // 检查按钮是否被禁用
  function isButtonDisabled(buttonId) {
    const button = document.getElementById(buttonId);
    return button.disabled;
  }

  // 触发按钮点击
  function triggerButtonClick(buttonId) {
    if (!isButtonDisabled(buttonId)) {
      document.getElementById(buttonId).click();
    }
  }

  switch (key) {
    case 'd':
      event.preventDefault();
      triggerButtonClick('codewiki-btn');
      break;
    case '1':
      event.preventDefault();
      triggerButtonClick('github1s-btn');
      break;
    case 'g':
      event.preventDefault();
      triggerButtonClick('github-btn');
      break;
    case 'escape':
      event.preventDefault();
      window.close();
      break;
  }
});

// 页面加载时聚焦到body，确保键盘事件能被捕获
document.addEventListener('DOMContentLoaded', () => {
  document.body.focus();
  document.body.setAttribute('tabindex', '-1');
});