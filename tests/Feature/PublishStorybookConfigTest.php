<?php

namespace A17\Blast\Tests\Feature;

use A17\Blast\Commands\PublishStorybookConfig;
use Illuminate\Filesystem\Filesystem;
use Orchestra\Testbench\TestCase;
use ReflectionProperty;

class PublishStorybookConfigTest extends TestCase
{
    protected Filesystem $filesystem;

    protected string $fakeVendorPath;

    protected string $mainJsFixture = <<<'JS'
    module.exports = {
        stories: ['../stories/**/*.stories.json'],
        addons: [
            '@storybook/addon-links',
            '@storybook/addon-essentials',
            '@storybook/addon-a11y',
        ],
    };
    JS;

    protected string $previewJsFixture = <<<'JS'
    import '../public/main.css';
    import { marked } from 'marked';
    import DOMPurify from 'dompurify';
    import { DEFENSIVE_CSS } from '../resources/storybook/utilities/styles';
    import {
        parseDocBlocks,
        mountDocBlocksInteractivity
    } from '../resources/storybook/API/doc-blocks';
    JS;

    protected function getPackageProviders($app)
    {
        return [\A17\Blast\BlastServiceProvider::class];
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->filesystem = new Filesystem();

        $this->fakeVendorPath = base_path('fake-vendor/area17/blast');
        $this->filesystem->ensureDirectoryExists(
            $this->fakeVendorPath . '/.storybook',
        );
        $this->filesystem->put(
            $this->fakeVendorPath . '/.storybook/preview.js',
            $this->previewJsFixture,
        );
        $this->filesystem->put(
            $this->fakeVendorPath . '/.storybook/main.js',
            $this->mainJsFixture,
        );

        $this->filesystem->deleteDirectory(base_path('.storybook'));

        $this->app->bind(PublishStorybookConfig::class, function ($app) {
            $command = new PublishStorybookConfig(
                $app->make(Filesystem::class),
            );

            $property = new ReflectionProperty(
                PublishStorybookConfig::class,
                'vendorPath',
            );
            $property->setAccessible(true);
            $property->setValue($command, $this->fakeVendorPath);

            return $command;
        });
    }

    protected function tearDown(): void
    {
        $this->filesystem->deleteDirectory(base_path('fake-vendor'));
        $this->filesystem->deleteDirectory(base_path('.storybook'));

        parent::tearDown();
    }

    public function test_it_copies_storybook_config_when_project_config_does_not_exist_yet(): void
    {
        $this->artisan('blast:publish-storybook-config')->assertExitCode(0);

        $this->assertFileExists(base_path('.storybook/preview.js'));
        $this->assertFileExists(base_path('.storybook/main.js'));
    }

    public function test_it_rewrites_bare_package_imports_in_preview_js(): void
    {
        $this->artisan('blast:publish-storybook-config');

        $contents = $this->filesystem->get(base_path('.storybook/preview.js'));

        $this->assertStringContainsString(
            "from '../vendor/area17/blast/node_modules/marked'",
            $contents,
        );
        $this->assertStringContainsString(
            "from '../vendor/area17/blast/node_modules/dompurify'",
            $contents,
        );
        $this->assertStringNotContainsString("from 'marked'", $contents);
        $this->assertStringNotContainsString("from 'dompurify'", $contents);
    }

    public function test_it_rewrites_relative_internal_imports_in_preview_js(): void
    {
        $this->artisan('blast:publish-storybook-config');

        $contents = $this->filesystem->get(base_path('.storybook/preview.js'));

        $this->assertStringContainsString(
            "from '../vendor/area17/blast/resources/storybook/utilities/styles'",
            $contents,
        );
        $this->assertStringContainsString(
            "from '../vendor/area17/blast/resources/storybook/API/doc-blocks'",
            $contents,
        );
    }

    public function test_it_rewrites_the_main_css_path_in_preview_js(): void
    {
        $this->artisan('blast:publish-storybook-config');

        $contents = $this->filesystem->get(base_path('.storybook/preview.js'));

        $this->assertStringContainsString(
            '../vendor/area17/blast/public/main.css',
            $contents,
        );
    }

    public function test_it_rewrites_stories_glob_in_main_js(): void
    {
        $this->artisan('blast:publish-storybook-config');

        $contents = $this->filesystem->get(base_path('.storybook/main.js'));

        $this->assertStringContainsString(
            "'../vendor/area17/blast/stories/**/*.stories.json'",
            $contents,
        );
    }

    public function test_it_expands_addon_essentials_into_individual_dist_paths_in_main_js(): void
    {
        $this->artisan('blast:publish-storybook-config');

        $contents = $this->filesystem->get(base_path('.storybook/main.js'));

        $essentials = [
            'actions',
            'backgrounds',
            'controls',
            'docs',
            'highlight',
            'measure',
            'outline',
            'toolbars',
            'viewport',
        ];

        foreach ($essentials as $essential) {
            $this->assertStringContainsString(
                "../vendor/area17/blast/node_modules/@storybook/addon-essentials/dist/{$essential}",
                $contents,
            );
        }

        $this->assertStringNotContainsString(
            '@storybook/addon-essentials\'',
            $contents,
        );
    }

    public function test_it_rewrites_addon_links_with_dist_suffix_in_main_js(): void
    {
        $this->artisan('blast:publish-storybook-config');

        $contents = $this->filesystem->get(base_path('.storybook/main.js'));

        $this->assertStringContainsString(
            "'../vendor/area17/blast/node_modules/@storybook/addon-links/dist'",
            $contents,
        );
    }

    public function test_it_rewrites_regular_addons_without_dist_suffix_in_main_js(): void
    {
        $this->artisan('blast:publish-storybook-config');

        $contents = $this->filesystem->get(base_path('.storybook/main.js'));

        $this->assertStringContainsString(
            "'../vendor/area17/blast/node_modules/@storybook/addon-a11y'",
            $contents,
        );
        $this->assertStringNotContainsString(
            '../vendor/area17/blast/node_modules/@storybook/addon-a11y/dist',
            $contents,
        );
    }

    public function test_it_asks_for_confirmation_when_project_config_already_exists(): void
    {
        $this->filesystem->ensureDirectoryExists(base_path('.storybook'));
        $this->filesystem->put(
            base_path('.storybook/preview.js'),
            'old content',
        );

        $this->artisan('blast:publish-storybook-config')
            ->expectsConfirmation(
                'Config already exists in project directory. Overwrite? This cannot be undone.',
                'no',
            )
            ->expectsOutput('Aborting')
            ->assertExitCode(0);

        $this->assertSame(
            'old content',
            $this->filesystem->get(base_path('.storybook/preview.js')),
        );
    }

    public function test_it_overwrites_project_config_when_user_confirms(): void
    {
        $this->filesystem->ensureDirectoryExists(base_path('.storybook'));
        $this->filesystem->put(
            base_path('.storybook/preview.js'),
            'old content',
        );

        $this->artisan('blast:publish-storybook-config')
            ->expectsConfirmation(
                'Config already exists in project directory. Overwrite? This cannot be undone.',
                'yes',
            )
            ->assertExitCode(0);

        $contents = $this->filesystem->get(base_path('.storybook/preview.js'));

        $this->assertStringNotContainsString('old content', $contents);
        $this->assertStringContainsString(
            "from '../vendor/area17/blast/node_modules/marked'",
            $contents,
        );
    }

    public function test_it_updates_both_preview_js_and_main_js_in_a_single_run(): void
    {
        $this->artisan('blast:publish-storybook-config')->assertExitCode(0);

        $preview = $this->filesystem->get(base_path('.storybook/preview.js'));
        $main = $this->filesystem->get(base_path('.storybook/main.js'));

        $this->assertStringContainsString(
            'vendor/area17/blast/node_modules/marked',
            $preview,
        );
        $this->assertStringContainsString(
            'vendor/area17/blast/node_modules/@storybook/addon-links',
            $main,
        );
    }
}
