import { render, screen } from '@testing-library/react'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import store from './store/store'
import { Provider } from 'react-redux'

test('renders app', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>)
  const element = screen.getByText(/Traffic flow/i)
  expect(element).toBeInTheDocument()
})
