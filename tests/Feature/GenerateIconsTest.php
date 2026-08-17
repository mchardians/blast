<?php

namespace A17\Blast\Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\File;

class GenerateIconsTest extends TestCase
{
    /**
     * @var string
     */
    protected $tempSourceCss;

    /**
     * @var string
     */
    protected $tempOutputJson;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tempSourceCss = __DIR__ . '/temp_keenicons_mock.css';
        $this->tempOutputJson = __DIR__ . '/temp_keenicons_output.json';
    }

    protected function tearDown(): void
    {
        if (File::exists($this->tempSourceCss)) {
            File::delete($this->tempSourceCss);
        }

        if (File::exists($this->tempOutputJson)) {
            File::delete($this->tempOutputJson);
        }

        parent::tearDown();
    }

    /** @test */
    public function it_generates_json_manifest_from_valid_css_content()
    {
        $cssContent = "
            .ki-duotone.ki-user::before { content: '\\e001'; }
            .ki-outline.ki-arrow-right::before { content: '\\e002'; }
            .ki-solid.ki-setting-2::before { content: '\\e003'; }
            .ki-duotone.ki-user::before { content: '\\e001'; } /* Intentional duplicate */
        ";
        File::put($this->tempSourceCss, $cssContent);

        $this->artisan('blast:generate-icons', [
            '--source' => $this->tempSourceCss,
            '--output' => $this->tempOutputJson,
        ])
            ->expectsOutput("Scanning CSS file: {$this->tempSourceCss}")
            ->expectsOutput(
                'Successfully generated JSON manifest with 3 icons.',
            )
            ->assertExitCode(0);

        $this->assertTrue(File::exists($this->tempOutputJson));

        $generatedJson = json_decode(File::get($this->tempOutputJson), true);

        $this->assertCount(3, $generatedJson);

        $this->assertEquals('User', $generatedJson[0]['name']);
        $this->assertEquals('ki-duotone ki-user', $generatedJson[0]['class']);

        $this->assertEquals('Arrow Right', $generatedJson[1]['name']);
        $this->assertEquals(
            'ki-outline ki-arrow-right',
            $generatedJson[1]['class'],
        );
    }

    /** @test */
    public function it_fails_gracefully_when_source_file_is_missing()
    {
        $invalidPath = __DIR__ . '/non_existent_file.css';

        $this->artisan('blast:generate-icons', [
            '--source' => $invalidPath,
            '--output' => $this->tempOutputJson,
        ])
            ->expectsOutput("Source CSS file not found at: {$invalidPath}")
            ->assertExitCode(1);

        $this->assertFalse(File::exists($this->tempOutputJson));
    }

    /** @test */
    public function it_fails_gracefully_when_no_icons_are_found_in_css()
    {
        $cssContent = '.btn-primary { color: red; } .header { margin: 0; }';
        File::put($this->tempSourceCss, $cssContent);

        $this->artisan('blast:generate-icons', [
            '--source' => $this->tempSourceCss,
            '--output' => $this->tempOutputJson,
        ])
            ->expectsOutput(
                'No icons found matching the Keenicons pattern in the provided CSS file.',
            )
            ->assertExitCode(1);

        $this->assertFalse(File::exists($this->tempOutputJson));
    }
}
