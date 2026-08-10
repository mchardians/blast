import { formatSourceCode } from '../../resources/storybook/helpers/formatSourceCode';
import { parseTypography } from '../../resources/storybook/API/doc-blocks/typography/typography';
import { parseCanvas } from '../../resources/storybook/API/doc-blocks/canvas/canvas';
import { parseStory } from '../../resources/storybook/API/doc-blocks/story/story';
import { parseControls } from '../../resources/storybook/API/doc-blocks/controls/controls';
import { parseSource } from '../../resources/storybook/API/doc-blocks/source/source';
import { parseIconGallery } from '../../resources/storybook/API/doc-blocks/icon-gallery/icon-gallery';

describe('Modular Custom Doc Blocks Architecture', () => {
    const mockContext = {
        baseStoryId: 'components-button--default',
        title: 'Button',
        description: 'Primary interactive button component.',
        sourceCode:
            '<x-ui.button :variant="$variant" :is-circle="$isCircle">{{ $label }}</x-ui.button>',
        defaultArgs: { label: 'Save', variant: 'primary', isCircle: false },
        argTypes: {}
    };

    describe('1. Helpers (formatSourceCode)', () => {
        it('renders standard attributes and content variables correctly', () => {
            const result = formatSourceCode(
                mockContext.sourceCode,
                mockContext.defaultArgs
            );
            expect(result).toContain('Save');
            expect(result).toContain('variant="primary"');
            expect(result).not.toContain('{{ $label }}');
        });

        it('removes false boolean attributes cleanly', () => {
            const result = formatSourceCode(
                mockContext.sourceCode,
                mockContext.defaultArgs
            );
            expect(result).not.toContain('is-circle');
        });
    });

    describe('2. Typography Module', () => {
        it('renders [render-title] and [render-description] macros', () => {
            const rawHtml =
                '<div>[render-title]</div><article>[render-description]</article>';
            const result = parseTypography(rawHtml, mockContext);

            expect(result).toContain('<h1 class="sb-docs-title">Button</h1>');
            expect(result).toContain('<p class="sb-docs-description"');
            expect(result).toContain(
                'Primary interactive button component.</p>'
            );
        });
    });

    describe('3. Canvas Module', () => {
        it('builds full Iframe structure along with custom arguments', () => {
            const rawHtml = '[render-canvas:variant:destructive]';
            const result = parseCanvas(rawHtml, mockContext);

            expect(result).toContain('<iframe class="sb-inline-canvas"');
            expect(result).toContain('data-story="components-button--default"');
            expect(result).toContain('args=variant:destructive');
            expect(result).toContain('class="sb-canvas-toolbar"');
        });
    });

    describe('4. Story Module', () => {
        it('renders pure iframe without additional canvas interface', () => {
            const rawHtml = '[render-story:variant:outline]';
            const result = parseStory(rawHtml, mockContext);

            expect(result).toMatch(/<iframe\s+class="sb-inline-canvas"/);

            expect(result).toContain('args=variant:outline');
            expect(result).not.toContain('class="sb-canvas-toolbar"');
        });
    });

    describe('5. Controls Module', () => {
        it('renders injection target container for interactive table', () => {
            const rawHtml = '[render-controls]';
            const result = parseControls(rawHtml);

            expect(result).toContain(
                '<div class="sb-custom-controls-wrapper"></div>'
            );
        });
    });

    describe('6. Source Module', () => {
        it('renders standalone code block with formatted source', () => {
            const rawHtml = '[render-source]';
            const result = parseSource(rawHtml, mockContext);

            expect(result).toContain(
                'class="sb-canvas-code-block sb-standalone-source"'
            );
            expect(result).toContain('variant=&quot;primary&quot;');
        });
    });

    describe('7. IconGallery Module', () => {
        it('builds an asynchronous gallery container with the correct data URL attribute', () => {
            const rawHtml = '[render-icongallery: /data/icons.json]';
            const result = parseIconGallery(rawHtml);

            expect(result).toMatch(/class="sb-icon-gallery-wrapper"/);
            expect(result).toMatch(/data-json-url="\/data\/icons\.json"/);
            expect(result).toMatch(/class="sb-icon-gallery-loader"/);
        });
    });
});
