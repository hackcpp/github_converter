console.log('Background service worker loaded');

// 监听全局快捷键命令
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  
  // 获取当前活动标签页
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs.length === 0) return;
    
    const currentTab = tabs[0];
    const url = currentTab.url;
    
    try {
      let newUrl;
      switch (command) {
        case 'convert-to-codewiki':
          newUrl = convertToCodeWiki(url);
          break;
        case 'convert-to-github1s':
          newUrl = convertToGitHub1s(url);
          break;
        case 'convert-to-github':
          newUrl = convertToGitHub(url);
          break;
        default:
          return;
      }
      
      if (newUrl !== url) {
        chrome.tabs.update(currentTab.id, { url: newUrl });
      }
    } catch (error) {
      console.error('URL conversion failed:', error);
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  try {
    if (request.action === 'convertToCodeWiki') {
      const url = convertToCodeWiki(request.url);
      console.log('Converted URL:', url);
      chrome.tabs.update({ url }, (tab) => {
        if (chrome.runtime.lastError) {
          sendResponse({success: false, error: chrome.runtime.lastError.message});
        } else {
          sendResponse({success: true});
        }
      });
    } else if (request.action === 'convertToGitHub1s') {
      const url = convertToGitHub1s(request.url);
      console.log('Converted URL:', url);
      chrome.tabs.update({ url }, (tab) => {
        if (chrome.runtime.lastError) {
          sendResponse({success: false, error: chrome.runtime.lastError.message});
        } else {
          sendResponse({success: true});
        }
      });
    } else if (request.action === 'convertToGitHub') {
      const url = convertToGitHub(request.url);
      console.log('Converted URL:', url);
      chrome.tabs.update({ url }, (tab) => {
        if (chrome.runtime.lastError) {
          sendResponse({success: false, error: chrome.runtime.lastError.message});
        } else {
          sendResponse({success: true});
        }
      });
    }
  } catch (error) {
    console.error('URL conversion failed:', error);
    sendResponse({success: false, error: error.message});
  }
  return true; // 保持消息通道开放
});

function convertToCodeWiki(url) {
  const urlObj = new URL(url);
  if (urlObj.hostname.includes('github.com') || urlObj.hostname.includes('github1s.com')) {
    const pathParts = urlObj.pathname.split('/').slice(1, 3); // 获取owner/repo部分
    return `https://codewiki.google/github.com/${pathParts.join('/')}`;
  }
  return url;
}

function convertToGitHub1s(url) {
  const urlObj = new URL(url);
  if (urlObj.hostname.includes('github.com') || urlObj.hostname.includes('codewiki.google')) {
    const pathParts = urlObj.pathname.split('/').slice(1, 3); // 获取owner/repo部分
    return `https://github1s.com/${pathParts.join('/')}`;
  }
  return url;
}

function convertToGitHub(url) {
  console.log('convertToGitHub called with:', url);
  const urlObj = new URL(url);
  console.log('hostname:', urlObj.hostname);
  if (urlObj.hostname.includes('github1s.com') || urlObj.hostname.includes('codewiki.google')) {
    const pathParts = urlObj.pathname.split('/').filter(part => part); // 过滤空字符串
    console.log('pathParts:', pathParts);
    let owner, repo;
    
    if (urlObj.hostname.includes('codewiki.google')) {
      // CodeWiki URL格式: /github.com/owner/repo
      owner = pathParts[1]; // github.com之后的owner
      repo = pathParts[2]; // github.com之后的repo
      console.log('CodeWiki format - owner:', owner, 'repo:', repo);
    } else {
      // GitHub1s URL格式: /owner/repo
      owner = pathParts[0];
      repo = pathParts[1];
      console.log('GitHub1s format - owner:', owner, 'repo:', repo);
    }
    
    if (owner && repo) {
      const result = `https://github.com/${owner}/${repo}`;
      console.log('convertToGitHub result:', result);
      return result;
    }
  }
  console.log('convertToGitHub returning original url:', url);
  return url;
}