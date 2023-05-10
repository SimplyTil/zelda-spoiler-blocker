// Spoiler Array - Contains all the spoilers to be replaced
const spoilers = [
  { find: /zelda/i, replace: 'SPOILER' },
  { find: /totk/i, replace: 'SPOILER' },
  { find: /hyrule/i, replace: 'SPOILER' },
  { find: /tears\s*of\s*the\s*kingdom/i, replace: 'SPOILER' },
  { find: /himmelsinseln/i, replace: 'SPOILER' },
  { find: /kataklysmus/i, replace: 'SPOILER' },
  { find: /sky\s*islands/i, replace: 'SPOILER' },
  { find: /leak/i, replace: 'SPOILER' }
];

// Replace spoilers function that replaces spoilers in the text and hides the parent element
function replaceSpoilers(node) {
  let hasSpoilers = false;
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent.trim();
    for (const { find, replace } of spoilers) {
      const regex = new RegExp(find, 'gi');
      if (regex.test(text)) {
        const parentElement = node.parentElement;
        if (parentElement) {
          parentElement.style.display = 'none';
          parentElement.classList.add('spoilered');
        }
        hasSpoilers = true;
        break;
      }
    }
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    node.nodeName !== 'SCRIPT' &&
    node.nodeName !== 'STYLE'
  ) {
    if (node.nodeName === 'A') {
      for (const { find } of spoilers) {
        const regex = new RegExp(find, 'i');
        if (regex.test(node.textContent)) {
          node.addEventListener('click', (event) => {
            event.preventDefault();
            window.open('https://leckerer.link/h6ln2', '_blank');
          });
          node.classList.add('spoilered-link');
        }
      }
    }
    for (const childNode of node.childNodes) {
      hasSpoilers = replaceSpoilers(childNode) || hasSpoilers;
    }
  }
  return hasSpoilers;
}

const button = document.createElement('button');
button.innerText = 'Show/Hide Spoilers';
button.classList.add('spoiler-button');
button.addEventListener('click', () => {
  const spoileredElements = document.querySelectorAll('.spoilered');
  spoileredElements.forEach((element) => {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  });
});

if (replaceSpoilers(document.body)) {
  document.body.appendChild(button);
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (replaceSpoilers(node)) { // Check if there is at least one spoiler in the added node
        button.style.display = 'block'; // Show the button
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Add CSS styles to visually hide the spoilers and the spoiler button
const styles = `
.spoilered {
  background-color: transparent !important;
  position: relative !important;
  z-index: 1 !important;
  text-shadow: none !important;
}

.spoiler-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  font-size: 16px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 9999;
}

.spoilered-link {
  text-decoration: underline dotted;
}

.spoilered-link:hover {
  cursor: not-allowed;
}
`;

const styleSheet = document.createElement('style');
styleSheet.innerHTML = styles;
document.head.appendChild(styleSheet);