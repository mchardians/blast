<?php

namespace A17\Blast\Tests\Unit;

use Tests\TestCase;

class ConfigTest extends TestCase
{
    public function test_it_loads_default_storybook_host_for_windows_safety()
    {
        $this->assertEquals('127.0.0.1', config('blast.storybook_host'));
    }

    public function test_it_can_override_storybook_host_via_environment_for_docker()
    {
        config(['blast.storybook_host' => '0.0.0.0']);

        $this->assertEquals('0.0.0.0', config('blast.storybook_host'));
    }
}
