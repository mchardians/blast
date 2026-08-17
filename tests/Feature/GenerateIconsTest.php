<?php

namespace A17\Blast\Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\File;

class GenerateIconsTest extends TestCase
{
    protected string $fakeConfigSource;
    protected string $fakeConfigOutput;
    protected string $cliSourcePath;
    protected string $cliOutputPath;

    protected function getPackageProviders($app)
    {
        return [\A17\Blast\BlastServiceProvider::class];
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->fakeConfigSource = base_path('fake-assets/plugins.bundle.css');
        $this->fakeConfigOutput = base_path(
            'fake-assets/config-keenicons.json',
        );

        $this->cliSourcePath = base_path('fake-assets/cli-plugins.bundle.css');
        $this->cliOutputPath = base_path('fake-assets/cli-keenicons.json');

        File::ensureDirectoryExists(base_path('fake-assets'));

        $cssConfigDummy = "
            .ki-duotone.ki-abstract-14::before { content: '\e900'; }
            .ki-outline.ki-user::before { content: '\e901'; }
        ";
        File::put($this->fakeConfigSource, $cssConfigDummy);

        $cssCliDummy = "
            .ki-solid.ki-rocket::before { content: '\e902'; }
        ";
        File::put($this->cliSourcePath, $cssCliDummy);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(base_path('fake-assets'));
        parent::tearDown();
    }

    public function test_it_uses_config_when_cli_options_are_missing(): void
    {
        config()->set('blast.icon_gallery.source', $this->fakeConfigSource);
        config()->set('blast.icon_gallery.output', $this->fakeConfigOutput);

        $this->artisan('blast:generate-icons')->assertExitCode(0);

        $this->assertFileExists($this->fakeConfigOutput);

        $contents = json_decode(File::get($this->fakeConfigOutput), true);
        $iconNames = array_column($contents, 'name');

        $this->assertCount(2, $contents);
        $this->assertContains('Abstract 14', $iconNames);
        $this->assertContains('User', $iconNames);
    }

    public function test_it_prioritizes_cli_options_over_config(): void
    {
        config()->set('blast.icon_gallery.source', $this->fakeConfigSource);
        config()->set('blast.icon_gallery.output', $this->fakeConfigOutput);

        $this->artisan('blast:generate-icons', [
            '--source' => $this->cliSourcePath,
            '--output' => $this->cliOutputPath,
        ])->assertExitCode(0);

        $this->assertFileExists($this->cliOutputPath);
        $this->assertFileDoesNotExist($this->fakeConfigOutput);

        $contents = json_decode(File::get($this->cliOutputPath), true);

        $this->assertCount(1, $contents);
        $this->assertEquals('Rocket', $contents[0]['name']);
        $this->assertEquals('ki-solid ki-rocket', $contents[0]['class']);
    }

    public function test_it_fails_gracefully_if_source_css_is_missing(): void
    {
        $invalidPath = base_path('fake-assets/does-not-exist.css');
        config()->set('blast.icon_gallery.source', $invalidPath);
        config()->set('blast.icon_gallery.output', $this->fakeConfigOutput);

        $this->artisan('blast:generate-icons')
            ->expectsOutputToContain(
                "Source CSS file not found at: {$invalidPath}",
            )
            ->assertExitCode(1);
    }
}
