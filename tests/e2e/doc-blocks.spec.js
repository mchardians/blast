import { test, expect } from '@playwright/test';

test.describe('Custom Doc Blocks DOM Integration', () => {
    let previewFrame;

    test.beforeEach(async ({ page }) => {
        await page.goto(
            'http://127.0.0.1:6006/?path=/docs/components-buttons--docs'
        );

        previewFrame = page.frameLocator('#storybook-preview-iframe');

        await previewFrame
            .locator('.sb-inline-canvas')
            .first()
            .waitFor({ state: 'visible' });
    });

    test('Canvas Module: Validates Show/Hide Code Block feature', async () => {
        const toggleBtn = previewFrame.locator('.sb-toggle-code-btn').first();
        const codeBlock = previewFrame.locator('.sb-canvas-code-block').first();

        await expect(codeBlock).toBeHidden();
        await expect(toggleBtn).toHaveText('Show code');

        await toggleBtn.click();

        await expect(codeBlock).toBeVisible();
        await expect(toggleBtn).toHaveText('Hide code');
    });

    test('Controls Module: Validates reactive Iframe URL updates', async () => {
        const iframe = previewFrame.locator('.sb-inline-canvas').first();
        const initialSrc = await iframe.getAttribute('src');

        const labelInput = previewFrame
            .locator('tr', { hasText: 'label' })
            .locator('input[type="text"]');

        await labelInput.fill('Test Label');
        await labelInput.press('Tab');

        const updatedSrc = await iframe.getAttribute('src');
        expect(updatedSrc).not.toEqual(initialSrc);

        expect(updatedSrc).toContain('label:Test Label');
    });

    test('Canvas Module: Validates Zoom manipulation does not break layout', async () => {
        const iframe = previewFrame.locator('.sb-inline-canvas').first();
        const zoomInBtn = previewFrame.locator('.sb-zoom-in').first();

        let style = (await iframe.getAttribute('style')) || '';
        expect(style).not.toContain('scale(1.25)');

        await zoomInBtn.click();

        style = (await iframe.getAttribute('style')) || '';
        expect(style).toContain('scale(1.25)');
    });
});
