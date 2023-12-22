import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';


describe('App', () => {
  it('should render', () => {
    // create a mock of the ipcRenderer
    const mockIpcRenderer = {
      on: jest.fn(),
      send: jest.fn(),
    };

    // add the mock to the window object
    (window as any).ipcRenderer = mockIpcRenderer;

    expect(render(<App />)).toBeTruthy();
  });
});
