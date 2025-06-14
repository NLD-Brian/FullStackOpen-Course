import { render, screen, } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';


    test('calls handleCreation with correct data when form is submitted', async () => {
        const user = userEvent.setup();
        const createBlog = vi.fn()
        const blogFormRef = { current: { toggleVisibility: vi.fn() } };

        const { container } = render(<BlogForm handleCreation={createBlog} blogFormRef={blogFormRef} />);
        
        const titleInput = container.querySelector('input[name="Title"]');
        const authorInput = container.querySelector('input[name="Author"]');
        const urlInput = container.querySelector('input[name="Url"]');
        
        await user.type(titleInput, 'Test Blog');
        await user.type(authorInput, 'Test Author');
        await user.type(urlInput, 'https://testblog.com');
    
        const submitButton = screen.getByRole('button', { name: /create/i });
        await user.click(submitButton);
    
        expect(createBlog).toHaveBeenCalledWith({
            title: 'Test Blog',
            author: 'Test Author',
            url: 'https://testblog.com'
        });
        expect(titleInput.value).toBe('');
        expect(authorInput.value).toBe('');
        expect(urlInput.value).toBe('');
        expect(blogFormRef.current.toggleVisibility).toHaveBeenCalled();
    }
    );
