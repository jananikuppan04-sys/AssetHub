import { test, expect } from '@playwright/test';

test.describe('AssetHub Smoke Tests', () => {
  // AssetHub is an authenticated app. For smoke testing without backend, we 
  // might just test the public routes, or we mock authentication. 
  // Since we rely on a mocked/frontend state right now, let's see if the 
  // app loads at all.
  
  test('should load the login page', async ({ page }) => {
    await page.goto('/');
    
    // The app should redirect to /login if not authenticated
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Zod validation should kick in
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });
});
