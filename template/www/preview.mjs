// ---------------------------------
// File can be ignored / deleted
// Used for demo purposes only
//----------------------------------

import { verify } from 'https://unpkg.com/zkwasm@0.1.6?module';
const typingSpeed = 60;
const typingElement = document.querySelector('.typing-text');

const helloSubmitButton = document.querySelector('#hello-submit-button');
const helloInput = document.querySelector('#hello-input');
const helloLoadingContainer = document.querySelector('#hello-loading-container');
const helloResult = document.querySelector('#hello-result');

const maliciousLoadingContainer = document.querySelector('#malicious-loading-container');
const maliciousButton = document.querySelector('#malicious-submit-button');
const maliciousInput1 = document.querySelector('#malicious-input');
const maliciousResult = document.querySelector('#malicious-result');

import { m } from './index.mjs';

export const lines = [
  '> console.log(binary);',
  'ArrayBuffer(9233)',
  '> let result = await m.invokeExport("greet", [new TextEncoder().encode("John")]);',
  '//hello John',
  '> console.log(result);',
  '{execution_time:947n, proof:  { bytes: Uint8Array(7788), inputs: Uint8Array(128) }, proving_time:26n }',
  '> console.log(verify);',
  'true',
  // Add more lines here
];

function typeText(element, text, index, callback) {
  if (index < text.length) {
    const highlightedText = Prism.highlight(
      text.slice(0, index + 1),
      Prism.languages.javascript,
      'javascript'
    );
    let cursor = '';
    if (index !== text.length - 1) {
      cursor = "<span class='solid-cursor'>|</span>";
    }
    element.innerHTML = highlightedText + cursor;
    setTimeout(() => {
      typeText(element, text, index + 1, callback);
    }, typingSpeed);
  } else {
    callback();
  }
}

export function processLines(lines, index = 0) {
  if (index < lines.length) {
    const text = lines[index];
    const lineElement = document.createElement('pre');
    lineElement.classList.add('language-javascript');
    typingElement.appendChild(lineElement);
    typeText(lineElement, text, 0, () => {
      if (index === lines.length - 1) {
        lineElement.classList.add('blinking-cursor');
      }
      processLines(lines, index + 1);
    });
  }
}

function createSubmitHandler(
  button,
  input,
  loadingContainer,
  resultElement,
  mod,
  malicious = false
) {
  return async () => {
    if (!m) return;
    let promptDiv = input.parentNode.querySelector('.prompt-div');
    if (!promptDiv) {
      promptDiv = document.createElement('div');
      promptDiv.classList.add('prompt-div');
      promptDiv.style.display = 'none';
      promptDiv.innerText = 'Please enter a value';
      input.parentNode.insertBefore(promptDiv, input);
    }
    input.addEventListener('input', () => {
      promptDiv.style.display = 'none';
      input.style.border = 'none';
    });
    if (!input.value) {
      if (promptDiv.style.display !== 'block') {
        promptDiv.style.display = 'block';
        promptDiv.style.color = 'red';
        input.style.border = '1px solid red';
      }

      return;
    }

    resultElement.innerHTML = '';
    button.disabled = true;
    loadingContainer.style.display = 'block'; // show the loading spinner container

    try {
      const result = await m.invokeExport(mod, [new TextEncoder().encode(input.value)]);

      resultElement.innerHTML = `Execution Time: ${result.execution_time} <br> Proving Time: ${result.proving_time}`;

      let proof = result.proof;

      if (malicious) {
        proof = { bytes: result.proof.bytes, inputs: new Uint8Array(128) };
      }

      const valid = await verify(proof);

      const verified = valid ? 'Verified' : 'Invalid';

      resultElement.innerHTML += `<br><span class=${valid ? 'valid' : 'invalid'}>${verified}`;
    } catch (error) {
      console.error(error);
    } finally {
      loadingContainer.style.display = 'none'; // hide the loading spinner container
      button.disabled = false;
    }
  };
}

helloSubmitButton.addEventListener(
  'click',
  createSubmitHandler(helloSubmitButton, helloInput, helloLoadingContainer, helloResult, 'greet')
);

maliciousButton.addEventListener(
  'click',
  createSubmitHandler(
    maliciousButton,
    maliciousInput1,
    maliciousLoadingContainer,
    maliciousResult,
    'greet',
    true
  )
);
