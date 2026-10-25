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
                            {--source= : Path to the CSS file that defines the icon classes}
                            {--output= : Path to save the generated JSON manifest}
                            {--pattern= : Regex used to find icon classes (each capture group is one class)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a JSON manifest of icons from an icon CSS file.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sourcePath =
            $this->option('source') ?: config('blast.icon_gallery.source');
        $outputPath =
            $this->option('output') ?:
            config('blast.icon_gallery.output') ?:
            public_path('assets/icons.json');
        $pattern =
            $this->option('pattern') ?:
            config('blast.icon_gallery.pattern') ?:
            '/\.([a-zA-Z][a-zA-Z0-9_\-]*)::?before/';
        $namePrefix = (string) config('blast.icon_gallery.name_prefix', '');

        if (!$sourcePath) {
            $this->error('No icon CSS source defined.');
            $this->info(
                'Provide it with the --source option or `icon_gallery.source` in config/blast.php.',
            );

            return self::FAILURE;
        }

        if (!File::isFile($sourcePath)) {
            $this->error("Source CSS file not found at: {$sourcePath}");
            $this->info(
                'Please provide the correct path using the --source option or config/blast.php.',
            );

            return self::FAILURE;
        }

        // Validasi pola regex dari config atau opsi CLI
        if (@preg_match($pattern, '') === false) {
            $this->error("Invalid icon pattern: {$pattern}");

            return self::FAILURE;
        }

        $this->info("Scanning CSS file: {$sourcePath}");

        $cssContent = File::get($sourcePath);

        preg_match_all($pattern, $cssContent, $matches, PREG_SET_ORDER);

        if (empty($matches)) {
            $this->warn(
                'No icons found matching the icons pattern in the provided CSS file.',
            );

            return self::FAILURE;
        }

        $uniqueIcons = [];

        foreach ($matches as $match) {
            // Setiap capture group adalah satu class; group terakhir menjadi nama
            $classes = array_values(array_filter(array_slice($match, 1)));

            if (empty($classes)) {
                continue;
            }

            $fullClass = implode(' ', $classes);

            if (isset($uniqueIcons[$fullClass])) {
                continue;
            }

            $nameClass = end($classes);

            if (
                $namePrefix !== '' &&
                Str::startsWith($nameClass, $namePrefix)
            ) {
                $nameClass = Str::after($nameClass, $namePrefix);
            }

            $uniqueIcons[$fullClass] = [
                'name' => Str::title(str_replace(['-', '_'], ' ', $nameClass)),
                'class' => $fullClass,
            ];
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
