<?php

namespace A17\Blast\Commands;

use Illuminate\Support\Str;
use A17\Blast\Traits\Helpers;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class PublishStorybookConfig extends Command
{
    use Helpers;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blast:publish-storybook-config';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish Storybook config files to project directory';

    /**
     * @var Filesystem
     */
    protected $filesystem;

    /**
     * @var string
     */
    private $vendorPath;

    /**
     * @param Filesystem $filesystem
     */
    public function __construct(Filesystem $filesystem)
    {
        parent::__construct();

        $this->filesystem = $filesystem;
        $this->vendorPath = $this->getVendorPath();
    }

    /*
     * Executes the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $blastConfigPath = $this->vendorPath . '/.storybook';
        $projectConfigPath = base_path('.storybook');
        $copyFiles = true;

        if ($this->filesystem->exists($projectConfigPath)) {
            $copyFiles = $this->confirm(
                'Config already exists in project directory. Overwrite? This cannot be undone.',
                false,
            );
        }

        if (!$copyFiles) {
            $this->error('Aborting');
            return 0;
        }

        $this->filesystem->copyDirectory($blastConfigPath, $projectConfigPath);

        if ($this->filesystem->exists($projectConfigPath . '/preview.js')) {
            $this->filesystem->replaceInFile(
                '../public/main.css',
                '../vendor/area17/blast/public/main.css',
                $projectConfigPath . '/preview.js',
            );
            $this->filesystem->replaceInFile(
                "from 'marked'",
                "from '../vendor/area17/blast/node_modules/marked'",
                $projectConfigPath . '/preview.js',
            );
            $this->filesystem->replaceInFile(
                "from 'dompurify'",
                "from '../vendor/area17/blast/node_modules/dompurify'",
                $projectConfigPath . '/preview.js',
            );
            $this->filesystem->replaceInFile(
                "from '../resources/storybook/utilities/styles'",
                "from '../vendor/area17/blast/resources/storybook/utilities/styles'",
                $projectConfigPath . '/preview.js',
            );
            $this->filesystem->replaceInFile(
                "from '../resources/storybook/API/doc-blocks'",
                "from '../vendor/area17/blast/resources/storybook/API/doc-blocks'",
                $projectConfigPath . '/preview.js',
            );
        }

        $mainJsPath = $projectConfigPath . '/main.js';

        if ($this->filesystem->exists($mainJsPath)) {
            $this->filesystem->replaceInFile(
                '../stories/**/*.stories.json',
                '../vendor/area17/blast/stories/**/*.stories.json',
                $mainJsPath,
            );

            $mainJsContents = $this->filesystem->get($mainJsPath);
            preg_match('/addons: [ \t]*\[(.*)\]/sU', $mainJsContents, $matches);

            if (filled($matches)) {
                $toReplace = preg_split(
                    '/(\s*,*\s*)*,+(\s*,*\s*)*/',
                    trim($matches[1]),
                );

                $replaceWith = [];

                foreach ($toReplace as $item) {
                    $cleanAddon = Str::of($item)
                        ->trim()
                        ->between("'", "'")
                        ->between('"', '"')
                        ->toString();

                    if (empty($cleanAddon)) {
                        continue;
                    }

                    if (!Str::contains($cleanAddon, 'vendor/area17/blast')) {
                        $newPath = "../vendor/area17/blast/node_modules/{$cleanAddon}";
                    } else {
                        $newPath = $cleanAddon;
                    }

                    $replaceWith[] = "'{$newPath}'";
                }

                $this->filesystem->replaceInFile(
                    $matches[1],
                    implode(",\n        ", $replaceWith),
                    $mainJsPath,
                );
            }
        }

        $this->info('Copied files to .storybook in your project directory');
        $this->info(
            'Note that any future changes to the storybook config files in blast will have to be manually applied to the config files in your project.',
        );
    }
}
