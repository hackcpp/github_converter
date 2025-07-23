(function() {
  const isConvertiblePage = 
    (window.location.hostname === 'github.com' && /\/[^/]+\/[^/]+\/blob\/.+/.test(window.location.pathname)) ||
    window.location.hostname.includes('github1s.com') || 
    window.location.hostname.includes('codewiki.google');

  if (isConvertiblePage) {
    chrome.runtime.sendMessage({
      type: 'pageStatus',
      isConvertible: true
    });
  }
})();