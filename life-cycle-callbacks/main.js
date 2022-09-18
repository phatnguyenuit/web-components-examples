// Create a class for the element
class Square extends HTMLElement {
  // Specify observed attributes so that
  // attributeChangedCallback will work
  static get observedAttributes() {
    return ['c', 'l'];
  }

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const div = document.createElement('div');
    const style = document.createElement('style');
    shadow.appendChild(style);
    shadow.appendChild(div);
  }

  connectedCallback() {
    console.log('Custom square element added to page.');
    updateStyle(this);
  }

  disconnectedCallback() {
    console.log('Custom square element removed from page.');
  }

  adoptedCallback() {
    console.log('Custom square element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.');
    console.log(
      JSON.stringify(
        {
          name,
          oldValue,
          newValue,
        },
        null,
        2
      )
    );
    updateStyle(this);
  }
}

customElements.define('custom-square', Square);

function updateStyle(elem) {
  const shadow = elem.shadowRoot;
  shadow.querySelector('style').textContent = `
    div {
      width: ${elem.getAttribute('l')}px;
      height: ${elem.getAttribute('l')}px;
      background-color: ${elem.getAttribute('c')};
    }
  `;
}

const addButton = document.querySelector('.add');
const updateButton = document.querySelector('.update');
const removeButton = document.querySelector('.remove');
/** @type {HTMLButtonElement} */
const adoptButton = document.querySelector('.adopt');

let square;

updateButton.disabled = true;
removeButton.disabled = true;
adoptButton.disabled = true;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const container = document.getElementById('custom-components');

addButton.onclick = function () {
  // Create a custom square element
  square = document.createElement('custom-square');
  square.setAttribute('l', '100');
  square.setAttribute('c', 'red');

  container.appendChild(square);

  updateButton.disabled = false;
  removeButton.disabled = false;
  adoptButton.disabled = false;
  addButton.disabled = true;
};

updateButton.onclick = function () {
  // Randomly update square's attributes
  square.setAttribute('l', random(50, 200));
  square.setAttribute(
    'c',
    `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`
  );
};

removeButton.onclick = function () {
  // Remove the square
  container.removeChild(square);

  updateButton.disabled = true;
  removeButton.disabled = true;
  adoptButton.disabled = true;
  addButton.disabled = false;
};

/**
 * Adopt Node
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptNode
 */
adoptButton.addEventListener('click', function () {
  const iframe = document.querySelector('iframe');

  iframe.contentDocument.body.appendChild(document.adoptNode(square));

  adoptButton.disabled = true;
  removeButton.disabled = true;
});
