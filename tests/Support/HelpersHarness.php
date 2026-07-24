<?php

namespace A17\Blast\Tests\Support;

use A17\Blast\Traits\Helpers;
use Symfony\Component\Process\Process;
use Illuminate\Console\Command;
use Illuminate\Console\OutputStyle;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

class HelpersHarness extends Command
{
    use Helpers;

    protected $signature = 'test:helpers-harness';

    public $vendorPath;

    public function __construct(string $vendorPath)
    {
        parent::__construct();

        $this->vendorPath = $vendorPath;

        // Command normalnya di-set output-nya oleh Artisan console kernel.
        // Karena harness ini di-instantiate manual (bukan lewat artisan()),
        // kita kasih OutputStyle dummy supaya $this->info()/error() di
        // dalam trait Helpers tidak crash (writeln on null).
        $this->output = new OutputStyle(new ArrayInput([]), new NullOutput());
    }

    public function handle()
    {
        //
    }

    public function publicPingUrl(string $url): int
    {
        return $this->pingUrl($url);
    }

    public function publicWaitForStorybookReady(
        Process $process,
        string $url,
        int $timeout = 60,
        int $interval = 1,
    ): bool {
        return $this->waitForStorybookReady(
            $process,
            $url,
            $timeout,
            $interval,
        );
    }

    public function publicRunStorybookWithReadyCheck(
        array $command,
        $envVars,
        string $host,
        int $port,
        int $readyTimeout = 60,
        bool $foreground = true,
    ) {
        return $this->runStorybookWithReadyCheck(
            $command,
            $envVars,
            $host,
            $port,
            $readyTimeout,
            $foreground,
        );
    }
}
