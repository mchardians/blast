<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class GenerateStoriesTest extends TestCase
{
    public function test_can_generate_all_components()
    {
        $this->copyStubs([
            'link.blade.php' => resource_path(
                'views/components/link/link.blade.php',
            ),
            'link.story.blade.php' => resource_path(
                'views/stories/link/link.blade.php',
            ),
            'paragraph.blade.php' => resource_path(
                'views/components/paragraph/paragraph.blade.php',
            ),
            'paragraph.story.blade.php' => resource_path(
                'views/stories/paragraph/paragraph.blade.php',
            ),
        ]);

        $linkStories = $this->vendorPath('stories/link.stories.json');
        $paragraphStories = $this->vendorPath('stories/paragraph.stories.json');

        $this->assertFalse(File::exists($linkStories));
        $this->assertFalse(File::exists($paragraphStories));

        Artisan::call('blast:generate-stories');

        $this->assertTrue(File::exists($linkStories));
        $this->assertTrue(File::exists($paragraphStories));
    }

    public function test_can_generate_nested_components_safely_on_any_os()
    {
        $this->copyStubs([
            'link.blade.php' => resource_path(
                'views/components/link/link.blade.php',
            ),

            'link.story.blade.php' => resource_path(
                'views/stories/ui/buttons/link.blade.php',
            ),
        ]);

        $nestedStoriesPath = $this->vendorPath(
            'stories/ui/buttons.stories.json',
        );

        $this->assertFalse(File::exists($nestedStoriesPath));

        Artisan::call('blast:generate-stories');

        $this->assertTrue(File::exists($nestedStoriesPath));
    }

    public function test_json_output_does_not_escape_slashes_to_prevent_webpack_acorn_crash()
    {
        $this->copyStubs([
            'link.blade.php' => resource_path(
                'views/components/link/link.blade.php',
            ),
            'link.story.blade.php' => resource_path(
                'views/stories/components/buttons/link.blade.php',
            ),
        ]);

        Artisan::call('blast:generate-stories');

        $jsonPath = $this->vendorPath(
            'stories/components/buttons.stories.json',
        );

        $this->assertTrue(File::exists($jsonPath));

        $rawJson = File::get($jsonPath);

        $this->assertStringNotContainsString(
            '\/',
            $rawJson,
            'The JSON output MUST NOT contain escaped slashes (\/) to prevent Storybook Webpack Acorn parser from crashing.',
        );

        $this->assertStringContainsString(
            '"title": "Components/Buttons"',
            $rawJson,
            'The title must use standard forward slashes.',
        );
    }

    public function test_can_generate_docs_using_dummy_blade_bridge()
    {
        $docsDir = resource_path('views/stories/infrastructure/cicd');
        File::ensureDirectoryExists($docsDir);

        File::put($docsDir . '/README.md', '# CI/CD Documentation');
        File::put(
            $docsDir . '/cicd.blade.php',
            "@storybook([\n    'name' => 'Docs',\n    'viewMode' => 'docs'\n])",
        );

        $cicdStoriesPath = $this->vendorPath(
            'stories/infrastructure/cicd.stories.json',
        );

        Artisan::call('blast:generate-stories');

        $this->assertTrue(
            File::exists($cicdStoriesPath),
            'The JSON file for the dummy blade bridge was not created.',
        );

        $cicdData = json_decode(File::get($cicdStoriesPath), true);

        $this->assertEquals('Infrastructure/Cicd', $cicdData['title']);

        $this->assertContains(
            'autodocs',
            $cicdData['tags'],
            'The autodocs tag must be included to generate the Docs page.',
        );

        $dummyStory = $cicdData['stories'][0];

        $this->assertEquals(
            'Docs',
            $dummyStory['name'],
            'The dummy story name must be "Docs" to trigger Single Story Hoisting.',
        );

        $this->assertEquals(
            'docs',
            $dummyStory['parameters']['viewMode'],
            'The viewMode must be forced to "docs".',
        );

        File::deleteDirectory(resource_path('views/stories/infrastructure'));
    }
}
