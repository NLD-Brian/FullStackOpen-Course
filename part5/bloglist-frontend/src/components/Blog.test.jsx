import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import Togglable from './Toggable';

describe('<Blog />', () => {
  let component;

  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
    user: { username: 'testuser' }
  };

  const user = {
    username: 'testuser'
  }

  const mockHandleLikes = vi.fn();

  beforeEach(() => {
    component = render(
      <Blog 
        blog={blog} 
        handleLikes={mockHandleLikes} 
        handleRemove={() => {}} 
        currentUser={user}
      />
    )
  })


test('renders title but not author initially', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
  }

  render(<Blog blog={blog} handleLikes={() => {}} handleRemove={() => {}} />);
  
  // Title should be visible
  expect(component.container).toHaveTextContent('Test Blog');
  
  // Author should NOT be visible
  expect(screen.queryByText('Test Author')).not.toBeInTheDocument();
});

test('renders url and likes when show details button is clicked', () => {
  const buttonView = component.getByText('view');
  fireEvent.click(buttonView);

  expect(component.container).toHaveTextContent('https://testblog.com');
  expect(component.container).toHaveTextContent('5 likes');
});

 test('ensures that if the like button is clicked twice, the event handler the component received as props is called twice.', () => {
    
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
  
    expect(mockHandleLikes.mock.calls.length).toBe(2)
  
  })

})
