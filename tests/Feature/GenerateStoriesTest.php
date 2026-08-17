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

    public function test_can_generate_one_component()
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

        Artisan::call('blast:generate-stories link');

        $this->assertTrue(File::exists($linkStories));
        $this->assertFalse(File::exists($paragraphStories));
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

    public function test_formats_story_titles_properly_using_headline()
    {
        $this->copyStubs([
            'link.blade.php' => resource_path(
                'views/components/link/link.blade.php',
            ),
            'paragraph.blade.php' => resource_path(
                'views/components/paragraph/paragraph.blade.php',
            ),

            'link.story.blade.php' => resource_path(
                'views/stories/getting-started/introduction-page/introduction.blade.php',
            ),

            'paragraph.story.blade.php' => resource_path(
                'views/stories/admin_dashboard/user_profile/profile.blade.php',
            ),
        ]);

        $gettingStartedPath = $this->vendorPath(
            'stories/getting-started/introduction-page.stories.json',
        );
        $adminDashboardPath = $this->vendorPath(
            'stories/admin_dashboard/user_profile.stories.json',
        );

        Artisan::call('blast:generate-stories');

        $this->assertTrue(
            File::exists($gettingStartedPath),
            'The JSON file for getting-started was not found.',
        );
        $this->assertTrue(
            File::exists($adminDashboardPath),
            'The JSON file for admin_dashboard was not found.',
        );

        $gettingStartedData = json_decode(File::get($gettingStartedPath), true);
        $adminDashboardData = json_decode(File::get($adminDashboardPath), true);

        $this->assertEquals(
            'Getting Started/Introduction Page',
            $gettingStartedData['title'],
        );
        $this->assertEquals(
            'Admin Dashboard/User Profile',
            $adminDashboardData['title'],
        );
    }

    public function test_can_generate_standalone_markdown_docs()
    {
        $mdPath = resource_path('views/stories/infrastructure/cicd/README.md');
        File::ensureDirectoryExists(dirname($mdPath));
        File::put($mdPath, '# CI/CD Documentation');

        $cicdStoriesPath = $this->vendorPath(
            'stories/infrastructure/cicd.stories.json',
        );

        $this->assertFalse(File::exists($cicdStoriesPath));

        Artisan::call('blast:generate-stories');

        $this->assertTrue(
            File::exists($cicdStoriesPath),
            'The JSON file for the standalone markdown (README.md) was not created.',
        );

        $cicdData = json_decode(File::get($cicdStoriesPath), true);

        $this->assertEquals('Infrastructure/Cicd', $cicdData['title']);
        $this->assertContains(
            'autodocs',
            $cicdData['tags'],
            'The autodocs tag must be included to generate the Docs page.',
        );

        $dummyStory = $cicdData['stories'][0];

        $this->assertContains(
            '!dev',
            $dummyStory['tags'],
            'The dummy component must be hidden using the !dev tag.',
        );

        $storyParams = $dummyStory['parameters'];

        $this->assertTrue(
            $storyParams['docs']['disable'],
            'The docs.disable parameter must be true to prevent iframe execution.',
        );
        $this->assertTrue(
            $storyParams['previewTabs']['canvas']['hidden'],
            'The Canvas tab must be hidden for standalone markdown files.',
        );

        File::deleteDirectory(resource_path('views/stories/infrastructure'));
    }
}
