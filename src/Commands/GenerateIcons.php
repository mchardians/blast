<?php

namespace A17\Blast\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class GenerateIcons extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blast:generate-icons
                            {--source= : The path to the Keenicons CSS file (e.g., public/assets/css/keenicons.css)}
                            {--output= : The path to save the generated JSON file (e.g., public/assets/keenicons.json)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a JSON manifest of icons from the Metronic Keenicons CSS file based on options or blast config.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sourcePath =
            $this->option('source') ?:
            config('blast.icon_gallery.source') ?:
            public_path('assets/plugins/global/plugins.bundle.css');

        $outputPath =
            $this->option('output') ?:
            config('blast.icon_gallery.output') ?:
            public_path('assets/keenicons.json');

        if (!File::exists($sourcePath)) {
            $this->error("Source CSS file not found at: {$sourcePath}");
            $this->info(
                'Please provide the correct path using the --source option or config/blast.php.',
            );
            return self::FAILURE;
        }

        $this->info("Scanning CSS file: {$sourcePath}");

        $cssContent = File::get($sourcePath);

        $pattern = '/\.(ki-[a-zA-Z0-9\-]+)\.(ki-[a-zA-Z0-9\-]+)::?before/';

        preg_match_all($pattern, $cssContent, $matches);

        if (empty($matches[0])) {
            $this->warn(
                'No icons found matching the Keenicons pattern in the provided CSS file.',
            );
            return self::FAILURE;
        }

        $types = $matches[1];
        $names = $matches[2];

        $uniqueIcons = [];

        for ($i = 0; $i < count($matches[0]); $i++) {
            $typeClass = $types[$i];
            $nameClass = $names[$i];
            $fullClass = "{$typeClass} {$nameClass}";

            if (!isset($uniqueIcons[$fullClass])) {
                $cleanName = str_replace('-', ' ', substr($nameClass, 3));
                $formattedName = Str::title($cleanName);

                $uniqueIcons[$fullClass] = [
                    'name' => $formattedName,
                    'class' => $fullClass,
                ];
            }
        }

        $icons = array_values($uniqueIcons);

        File::ensureDirectoryExists(dirname($outputPath));
        File::put($outputPath, json_encode($icons, JSON_PRETTY_PRINT));

        $this->info(
            'Successfully generated JSON manifest with ' .
                count($icons) .
                ' icons.',
        );
        $this->line("Saved to: {$outputPath}");

        return self::SUCCESS;
    }
}
