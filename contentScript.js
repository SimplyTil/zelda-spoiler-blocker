// Spoiler Array - Contains all the spoilers to be replaced
const spoilers = [
    { find: /zelda/i, replace: 'SPOILER' },
    { find: /totk/i, replace: 'SPOILER' },
    { find: /tears.?of.?the.?kingdom/i, replace: 'SPOILER' }
  ];
  
// Function to replace and hide spoilers  
  function replaceSpoilers(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      for (const { find, replace } of spoilers) {
        const regex = new RegExp(find, 'gi');
        if (regex.test(text)) {
          const parentElement = node.parentElement;
          if (parentElement) {
            parentElement.style.display = 'none';
          }
          break;
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
      for (const childNode of node.childNodes) {
        replaceSpoilers(childNode);
      }
    }
  }
  
  replaceSpoilers(document.body);
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        replaceSpoilers(node);
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  