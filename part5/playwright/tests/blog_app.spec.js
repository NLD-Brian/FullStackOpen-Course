const { test, expect, beforeEach, describe } = require('@playwright/test');
const { request } = require('http');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await request.post('http://localhost:3000/api/testing/reset');
    await request.post('http://localhost:3000/api/users', {
      data: {
        username: 'root',
        name: 'root',
        password: 'password123',
      },
    });
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.locator('#login-form');
    await expect(loginForm).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('#username', 'root');
      await page.fill('#password', 'password123');
      await page.click('#login-button');
      await expect(page.locator('#notification')).toHaveText('Login successful');
      await expect(page.locator('#user-info')).toHaveText('root');
      await expect(page.locator('#login-form')).toBeHidden();
    }
    );
    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('#username', 'root');
      await page.fill('#password', 'wrongpassword');
      await page.click('#login-button');
      await expect(page.locator('#notification')).toHaveText('Invalid username or password');
      await expect(page.locator('#login-form')).toBeVisible();
      await expect(page.locator('#user-info')).toBeHidden();
    }
    );
  }
  );
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('#username', 'root');
      await page.fill('#password', 'password123');
      await page.click('#login-button');
    });

    test('A blog can be created', async ({ page }) => {
      await page.fill('#title', 'Test Blog');
      await page.fill('#author', 'Test Author');
      await page.fill('#url', 'http://testblog.com');
      await page.click('#create-blog-button');
      await expect(page.locator('#notification')).toHaveText('Blog created successfully');
      await expect(page.locator('.blog')).toContainText('Test Blog');
    });
  });
  describe('Blog operations', () => {
    beforeEach(async ({ page }) => {
      await page.fill('#username', 'root');
      await page.fill('#password', 'password123');
      await page.click('#login-button');
      await page.fill('#title', 'Test Blog');
      await page.fill('#author', 'Test Author');
      await page.fill('#url', 'http://testblog.com');
      await page.click('#create-blog-button');
    });

    test('A blog can be liked', async ({ page }) => {
      const likeButton = page.locator('.like-button');
      await likeButton.click();
      await expect(page.locator('.likes')).toHaveText('1');
    });

    test('A blog can be deleted by the creator', async ({ page }) => {
      const deleteButton = page.locator('.delete-button');
      await deleteButton.click();
      await expect(page.locator('.blog')).toHaveCount(0);
    });

    test('A blog cannot be deleted by another user', async ({ page }) => {
      // Create another user
      await request.post('http://localhost:3000/api/users', {
        data: {
          username: 'anotherUser',
          name: 'Another User',
          password: 'password123',
        },
      });

      // Log in as another user
      await page.fill('#username', 'anotherUser');
      await page.fill('#password', 'password123');
      await page.click('#login-button');

      const deleteButton = page.locator('.delete-button');
      await expect(deleteButton).toBeHidden();
    });
  });
  describe('Blog sorting', () => {
    beforeEach(async ({ page }) => {
      await page.fill('#username', 'root');
      await page.fill('#password', 'password123');
      await page.click('#login-button');

      // Create multiple blogs
      for (let i = 1; i <= 5; i++) {
        await page.fill('#title', `Blog ${i}`);
        await page.fill('#author', `Author ${i}`);
        await page.fill('#url', `http://blog${i}.com`);
        await page.click('#create-blog-button');
      }
    });

    test('Blogs are sorted by likes in descending order', async ({ page }) => {
      const blogs = page.locator('.blog');
      const likeButtons = page.locator('.like-button');

      // Like some blogs
      for (let i = 1; i <= 3; i++) {
        await likeButtons.nth(i - 1).click();
      }

      // Check the order of blogs
      const blogTexts = await blogs.allTextContents();
      expect(blogTexts[0]).toContain('Blog 3'); // Most liked
      expect(blogTexts[1]).toContain('Blog 2'); // Second most liked
      expect(blogTexts[2]).toContain('Blog 1'); // Third most liked
    });
  });
});