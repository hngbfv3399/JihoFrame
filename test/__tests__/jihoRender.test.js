/**
 * @jest-environment jsdom
 */

import { createElement, renderApp } from '../../src/Jiho/jihoRender.js';
import { createState, resetState } from '../../src/Jiho/jihoFunc.js';

describe('JihoFrame Rendering System', () => {
  
  let container;
  
  beforeEach(() => {
    // 각 테스트마다 새로운 컨테이너 생성
    container = document.createElement('div');
    document.body.appendChild(container);
    resetState();
  });
  
  afterEach(() => {
    // 테스트 후 정리
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    resetState();
  });

  describe('createElement', () => {
    test('should create basic HTML element', () => {
      const element = createElement('div', { text: 'Hello World' });
      
      expect(element.tagName).toBe('DIV');
      expect(element.textContent).toBe('Hello World');
    });

    test('should apply style properties', () => {
      const element = createElement('div', {
        style: {
          color: 'red',
          fontSize: '16px',
          backgroundColor: 'blue'
        }
      });
      
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
      expect(element.style.backgroundColor).toBe('blue');
    });

    test('should set id and className', () => {
      const element = createElement('div', {
        id: 'test-id',
        className: 'test-class'
      });
      
      expect(element.id).toBe('test-id');
      expect(element.className).toBe('test-class');
    });

    test('should handle event listeners', () => {
      const mockHandler = jest.fn();
      const element = createElement('button', {
        text: 'Click me',
        event: {
          onClick: mockHandler
        }
      });
      
      element.click();
      expect(mockHandler).toHaveBeenCalled();
    });

    test('should handle array-style events (legacy)', () => {
      const mockHandler = jest.fn();
      const element = createElement('button', {
        text: 'Click me',
        event: [
          { onClick: mockHandler }
        ]
      });
      
      element.click();
      expect(mockHandler).toHaveBeenCalled();
    });

    test('should create input elements with proper attributes', () => {
      const element = createElement('input', {
        type: 'text',
        placeholder: 'Enter text',
        required: true,
        name: 'username'
      });
      
      expect(element.type).toBe('text');
      expect(element.placeholder).toBe('Enter text');
      expect(element.required).toBe(true);
      expect(element.name).toBe('username');
    });

    test('should create select with options', () => {
      const element = createElement('select', {
        options: [
          'Option 1',
          'Option 2',
          { value: 'opt3', label: 'Option 3' }
        ]
      });
      
      expect(element.children.length).toBe(3);
      expect(element.children[0].value).toBe('Option 1');
      expect(element.children[0].textContent).toBe('Option 1');
      expect(element.children[2].value).toBe('opt3');
      expect(element.children[2].textContent).toBe('Option 3');
    });

    test('should handle reactive text content', (done) => {
      const state = createState('text', 'Initial');
      const element = createElement('div', {
        text: () => state.value
      });
      
      expect(element.textContent).toBe('Initial');
      
      state.value = 'Updated';
      
      Promise.resolve().then(() => {
        expect(element.textContent).toBe('Updated');
        done();
      });
    });

    test('should handle reactive show/hide', (done) => {
      const state = createState('visible', true);
      const element = createElement('div', {
        text: 'Test',
        show: () => state.value
      });
      
      expect(element.style.display).toBe('');
      
      state.value = false;
      
      Promise.resolve().then(() => {
        expect(element.style.display).toBe('none');
        done();
      });
    });

    test('should handle reactive disabled state', (done) => {
      const state = createState('disabled', false);
      const element = createElement('button', {
        text: 'Test Button',
        disabled: () => state.value
      });
      
      expect(element.disabled).toBe(false);
      
      state.value = true;
      
      Promise.resolve().then(() => {
        expect(element.disabled).toBe(true);
        done();
      });
    });

    test('should handle function components', () => {
      const TestComponent = (props) => ({
        div: {
          text: `Hello, ${props.name}!`,
          style: { color: 'blue' }
        }
      });
      
      const element = createElement(TestComponent, { name: 'World' });
      
      expect(element.textContent).toBe('Hello, World!');
      expect(element.style.color).toBe('blue');
    });

    test('should handle string options', () => {
      const element = createElement('div', 'Simple text');
      
      expect(element.textContent).toBe('Simple text');
    });

    test('should return null for invalid tag', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const element = createElement(123, { text: 'test' });
      
      expect(element).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('JihoFrame: Tag must be a string, got:', 'number');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Form Elements', () => {
    test('should bind value to input', () => {
      const state = createState('input', 'initial');
      const element = createElement('input', {
        type: 'text',
        value: state
      });
      
      expect(element.value).toBe('initial');
      
      // 값 변경 시뮬레이션
      element.value = 'changed';
      element.dispatchEvent(new Event('input'));
      
      expect(state.value).toBe('changed');
    });

    test('should handle checkbox binding', () => {
      const state = createState('checked', false);
      const element = createElement('input', {
        type: 'checkbox',
        value: state
      });
      
      expect(element.checked).toBe(false);
      
      element.checked = true;
      element.dispatchEvent(new Event('input'));
      
      expect(state.value).toBe(true);
    });

    test('should handle textarea binding', () => {
      const state = createState('textarea', 'text');
      const element = createElement('textarea', {
        value: state,
        rows: 5,
        cols: 30
      });
      
      expect(element.value).toBe('text');
      expect(element.rows).toBe(5);
      expect(element.cols).toBe(30);
    });
  });

  describe('renderApp', () => {
    test('should render basic app', () => {
      function App() {
        return {
          layout: [
            {
              div: {
                text: 'Hello, JihoFrame!',
                style: { color: 'green' }
              }
            }
          ]
        };
      }
      
      renderApp(App, container);
      
      const renderedDiv = container.querySelector('div');
      expect(renderedDiv).toBeTruthy();
      expect(renderedDiv.textContent).toBe('Hello, JihoFrame!');
      expect(renderedDiv.style.color).toBe('green');
    });

    test('should handle reactive app', (done) => {
      const count = createState('count', 0);
      
      function App() {
        return {
          layout: [
            {
              div: {
                text: `Count: ${count.value}`,
                children: [
                  {
                    button: {
                      text: 'Increment',
                      event: {
                        onClick: () => count.value++
                      }
                    }
                  }
                ]
              }
            }
          ]
        };
      }
      
      renderApp(App, container);
      
      const button = container.querySelector('button');
      const div = container.querySelector('div');
      
      expect(div.textContent).toContain('Count: 0');
      
      button.click();
      
      Promise.resolve().then(() => {
        expect(div.textContent).toContain('Count: 1');
        done();
      });
    });

    test('should throw error for invalid app function', () => {
      expect(() => renderApp('not-a-function', container)).toThrow('App must be a function');
    });

    test('should throw error for invalid container', () => {
      function App() {
        return { layout: [] };
      }
      
      expect(() => renderApp(App, null)).toThrow('Container must be a valid DOM element');
    });

    test('should handle app returning invalid layout', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      function App() {
        return { layout: null };
      }
      
      renderApp(App, container);
      
      expect(consoleSpy).toHaveBeenCalledWith('JihoFrame: Layout must be an array');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('should handle errors in event handlers', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const element = createElement('button', {
        text: 'Error Button',
        event: {
          onClick: () => {
            throw new Error('Test error');
          }
        }
      });
      
      element.click();
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should handle invalid options', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const element = createElement('div', null);
      
      expect(element.tagName).toBe('DIV');
      
      consoleSpy.mockRestore();
    });

    test('should handle function options that return invalid objects', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const element = createElement('div', () => null);
      
      expect(element).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('JihoFrame: Options function returned invalid object');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Memory Management', () => {
    test('should cleanup event listeners and subscriptions', () => {
      const state = createState('cleanup', 'test');
      const element = createElement('div', {
        text: () => state.value,
        event: {
          onClick: () => console.log('clicked')
        }
      });
      
      // 엘리먼트가 unsubscriber를 가지고 있는지 확인
      expect(element._jihoUnsubscribers).toBeDefined();
      expect(Array.isArray(element._jihoUnsubscribers)).toBe(true);
      expect(element._jihoUnsubscribers.length).toBeGreaterThan(0);
    });
  });

  describe('Advanced Features', () => {
    test('should handle nested components', () => {
      function ChildComponent({ message }) {
        return {
          span: {
            text: message,
            style: { fontWeight: 'bold' }
          }
        };
      }
      
      function ParentComponent() {
        return {
          div: {
            children: [
              { h1: { text: 'Parent' } },
              { [ChildComponent]: { message: 'Child Message' } }
            ]
          }
        };
      }
      
      const element = createElement(ParentComponent);
      
      expect(element.querySelector('h1').textContent).toBe('Parent');
      expect(element.querySelector('span').textContent).toBe('Child Message');
      expect(element.querySelector('span').style.fontWeight).toBe('bold');
    });
  });
}); 