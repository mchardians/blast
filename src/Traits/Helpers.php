<?php

namespace A17\Blast\Traits;

use Symfony\Component\Process\Process;
use Illuminate\Support\Str;

trait Helpers
{
    protected $storybookDefaultVersion = '7.1.1';

    protected $storybookInstallVersion;

    /**
     * @return void
     */
    protected function runProcessInBlast(
        array $command,
        $disableTimeout = false,
        $envVars = null,
        $disableOutput = false,
        $disableTty = false,
    ) {
        $process = new Process($command, $this->vendorPath, $envVars);

        if ($disableTimeout) {
            $process->setTimeout(null);
        } else {
            $process->setTimeout(config('blast.build_timeout', 300));
        }

        if ($disableTty) {
            $process->setTty(false);
        } else {
            $process->setTty(Process::isTtySupported());
        }

        if ($disableOutput) {
            $process->disableOutput();
        } else {
            $process->enableOutput();
        }

        $process->run();

        if (!$disableOutput) {
            return $process->getOutput();
        }
    }

    protected function runStorybookWithReadyCheck(
        array $command,
        $envVars,
        string $host,
        int $port,
        int $readyTimeout = 60,
        bool $foreground = true,
    ) {
        $process = new Process($command, $this->vendorPath, $envVars);

        $process->setTimeout(null);
        $process->setTty($foreground && Process::isTtySupported());
        $process->enableOutput();

        $process->start();

        $url = "http://{$host}:{$port}/iframe.html";

        $this->info("Waiting for Storybook to be ready on {$url} ...");

        $ready = $this->waitForStorybookReady($process, $url, $readyTimeout);

        if ($ready) {
            $this->info("✔ Storybook ready di http://{$host}:{$port}");
        } else {
            if ($process->isRunning()) {
                $this->error(
                    "Storybook did not respond within $readyTimeout seconds, but the process is still running. Continuing to wait...",
                );
            } else {
                $this->error(
                    'The Storybook process stopped before it was ready.',
                );

                return $process;
            }
        }

        if ($foreground) {
            $process->wait();
        }

        return $process;
    }

    private function waitForStorybookReady(
        Process $process,
        string $url,
        int $timeout = 60,
        int $interval = 1,
    ): bool {
        $start = time();

        while (time() - $start < $timeout) {
            if (!$process->isRunning()) {
                return false;
            }

            $httpCode = $this->pingUrl($url);

            if ($httpCode >= 200 && $httpCode < 400) {
                return true;
            }

            sleep($interval);
        }

        return false;
    }

    private function pingUrl(string $url): int
    {
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        curl_exec($ch);

        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $httpCode;
    }

    /**
     * @return void
     */
    private function CopyDirectory($from, $to, $cleanDir = false)
    {
        $this->filesystem->ensureDirectoryExists($to);

        if ($cleanDir) {
            $this->filesystem->cleanDirectory($to);
        }

        if ($this->filesystem->exists($from)) {
            $this->filesystem->copyDirectory($from, $to);
        }
    }

    /**
     * Returns the full vendor_path for Blast.
     *
     * @return string
     */
    private function getVendorPath()
    {
        $vendorPath = config('blast.vendor_path');

        if ($this->isAbsolutePath($vendorPath)) {
            return $vendorPath;
        }

        return base_path($vendorPath);
    }

    private function isAbsolutePath(string $path): bool
    {
        return Str::startsWith($path, '/') ||
            (bool) preg_match('/^[a-zA-Z]:[\\\\\/]/', $path);
    }

    private function dependenciesInstalled()
    {
        return $this->filesystem->exists(
            $this->vendorPath . '/node_modules/@storybook',
        );
    }

    private function getInstallMessage($npmInstall)
    {
        $depsInstalled = $this->dependenciesInstalled();

        return ($npmInstall || (!$npmInstall && !$depsInstalled)
            ? 'Installing'
            : 'Reusing') . ' npm dependencies...';
    }

    protected function installDependencies($npmInstall)
    {
        $this->storybookInstallVersion = config('blast.storybook_version');
        $depsInstalled = $this->dependenciesInstalled();
        $updateStorybook = $this->checkStorybookVersions(
            $this->storybookInstallVersion,
        );

        if ($npmInstall || (!$npmInstall && !$depsInstalled)) {
            $this->runProcessInBlast(
                ['npm', 'ci', '--omit=dev', '--ignore-scripts'],
                false,
                null,
                true,
            );

            $this->installStorybook($this->storybookInstallVersion);
        } else {
            if ($updateStorybook) {
                $this->installStorybook($this->storybookInstallVersion);
            }
        }
    }

    private function installStorybook($storybookVersion)
    {
        if (!$storybookVersion) {
            $this->error(
                "No Storybook version defined. Using default version - $this->storybookDefaultVersion",
            );

            $this->storybookInstallVersion = $this->storybookDefaultVersion;
        } else {
            $this->storybookInstallVersion = $storybookVersion;
        }

        // check if version exists
        $this->info("Verifying Storybook @ $this->storybookInstallVersion");

        try {
            $this->runProcessInBlast(
                [
                    'npm',
                    'view',
                    "storybook@$this->storybookInstallVersion",
                    'version',
                    '--json',
                ],
                false,
                null,
                true,
            );

            $this->info('Verified');
        } catch (\Exception $e) {
            $this->error(
                "Problem verifying Storybook version. Using default version - $this->storybookDefaultVersion",
            );

            $this->storybookInstallVersion = $this->storybookDefaultVersion;

            usleep(250000);
        }

        $this->info("Installing Storybook @ $this->storybookInstallVersion");

        $deps = [
            "@storybook/addon-a11y@$this->storybookInstallVersion",
            "@storybook/addon-actions@$this->storybookInstallVersion",
            "@storybook/addon-docs@$this->storybookInstallVersion",
            "@storybook/addon-essentials@$this->storybookInstallVersion",
            "@storybook/addon-links@$this->storybookInstallVersion",
            "storybook@$this->storybookInstallVersion",
            "@storybook/server-webpack5@$this->storybookInstallVersion",
        ];

        try {
            $this->runProcessInBlast(
                ['npm', 'install', ...$deps],
                false,
                null,
                true,
            );
        } catch (\Exception $e) {
            $this->error($e->getMessage());

            exit();
        }
    }

    private function getInstalledStorybookVersion()
    {
        $version = false;
        $rawOutput = $this->runProcessInBlast(
            ['npm', 'list', 'storybook', '--json'],
            false,
            null,
            false,
            true,
        );
        $data = json_decode($rawOutput, true);

        if (isset($data['dependencies']['storybook'])) {
            $version = $data['dependencies']['storybook']['version'];
        }

        return $version;
    }

    private function checkStorybookVersions($storybookVersion)
    {
        // check if version matches installed version
        $installedStorybookVersion = $this->getInstalledStorybookVersion();

        if ($installedStorybookVersion !== $this->storybookInstallVersion) {
            $this->newLine();
            $this->info('Storybook version mismatch');
            $this->info("Installed: $installedStorybookVersion");
            $this->info("To Install: $this->storybookInstallVersion");

            return true;
        }

        return false;
    }
}
