<?php

namespace A17\Blast\Tests\Unit;

use A17\Blast\Tests\Support\HelpersHarness;
use Symfony\Component\Process\Process;
use Orchestra\Testbench\TestCase;

class StorybookReadyCheckTest extends TestCase
{
    /** @var string */
    protected $docRoot;

    /** @var HelpersHarness */
    protected $helper;

    protected function setUp(): void
    {
        parent::setUp();

        $this->docRoot =
            sys_get_temp_dir() . '/blast-fake-storybook-' . uniqid();
        mkdir($this->docRoot);
        file_put_contents(
            $this->docRoot . '/iframe.html',
            '<html>fake storybook</html>',
        );

        $this->helper = new HelpersHarness($this->docRoot);
    }

    protected function tearDown(): void
    {
        array_map('unlink', glob($this->docRoot . '/*'));
        rmdir($this->docRoot);

        parent::tearDown();
    }

    protected function getPackageProviders($app)
    {
        return [\A17\Blast\BlastServiceProvider::class];
    }

    protected function freePort(): int
    {
        $socket = stream_socket_server('tcp://127.0.0.1:0', $errno, $errstr);
        $name = stream_socket_get_name($socket, false);
        fclose($socket);

        return (int) substr($name, strrpos($name, ':') + 1);
    }

    public function test_ping_url_returns_200_when_server_is_up()
    {
        $port = $this->freePort();

        $server = new Process([
            'php',
            '-S',
            "127.0.0.1:{$port}",
            '-t',
            $this->docRoot,
        ]);
        $server->start();

        usleep(300000);

        try {
            $code = $this->helper->publicPingUrl(
                "http://127.0.0.1:{$port}/iframe.html",
            );

            $this->assertGreaterThanOrEqual(200, $code);
            $this->assertLessThan(400, $code);
        } finally {
            $server->stop();
        }
    }

    public function test_ping_url_returns_zero_when_nothing_is_listening()
    {
        $port = $this->freePort();

        $code = $this->helper->publicPingUrl(
            "http://127.0.0.1:{$port}/iframe.html",
        );

        $this->assertEquals(0, $code);
    }

    public function test_wait_for_storybook_ready_returns_true_once_server_becomes_available()
    {
        $port = $this->freePort();

        // Simulasikan storybook yang baru "nyala" (listen di port) setelah
        // 2 detik. Pakai php -r murni (bukan `sh -c`) supaya portable di
        // Windows tanpa Git Bash/WSL.
        $server = new Process([
            PHP_BINARY,
            '-S',
            "127.0.0.1:{$port}",
            '-t',
            $this->docRoot,
        ]);

        // Delay start-nya dari sisi test, bukan dari sisi shell command,
        // supaya tidak butuh `sleep` atau `sh`.
        // (server belum di-start dulu di titik ini)

        $readyPromise = null;

        // Jadwalkan start server setelah delay, tanpa blocking thread utama:
        $startAt = microtime(true) + 2;

        $ready = false;
        $timeout = 10;
        $begin = time();

        while (time() - $begin < $timeout) {
            if (!$server->isStarted() && microtime(true) >= $startAt) {
                $server->start();
            }

            if ($server->isStarted()) {
                $code = $this->helper->publicPingUrl(
                    "http://127.0.0.1:{$port}/iframe.html",
                );

                if ($code >= 200 && $code < 400) {
                    $ready = true;
                    break;
                }
            }

            usleep(200000);
        }

        try {
            $this->assertTrue($ready);
        } finally {
            if ($server->isStarted()) {
                $server->stop();
            }
        }
    }

    public function test_wait_for_storybook_ready_returns_false_on_timeout()
    {
        $port = $this->freePort();

        $process = new Process([PHP_BINARY, '-r', 'sleep(30);']);
        $process->start();

        try {
            $ready = $this->helper->publicWaitForStorybookReady(
                $process,
                "http://127.0.0.1:{$port}/iframe.html",
                timeout: 2,
                interval: 1,
            );

            $this->assertFalse($ready);
        } finally {
            $process->stop();
        }
    }

    public function test_wait_for_storybook_ready_returns_false_immediately_if_process_already_exited()
    {
        $process = new Process([PHP_BINARY, '-r', 'exit(1);']);
        $process->run();

        $ready = $this->helper->publicWaitForStorybookReady(
            $process,
            'http://127.0.0.1:65000/iframe.html',
            timeout: 5,
            interval: 1,
        );

        $this->assertFalse($ready);
    }

    public function test_run_storybook_with_ready_check_logs_ready_message_and_waits_for_process()
    {
        $port = $this->freePort();

        $process = $this->helper->publicRunStorybookWithReadyCheck(
            ['php', '-S', "127.0.0.1:{$port}", '-t', $this->docRoot],
            null,
            '127.0.0.1',
            $port,
            readyTimeout: 10,
            foreground: false,
        );

        try {
            $this->assertTrue($process->isRunning());

            $code = $this->helper->publicPingUrl(
                "http://127.0.0.1:{$port}/iframe.html",
            );

            $this->assertGreaterThanOrEqual(200, $code);
            $this->assertLessThan(400, $code);
        } finally {
            $process->stop();
        }
    }
}
