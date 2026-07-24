<?php

use A17\Blast\Controllers\StoryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

if (config('blast.enabled')) {
    $sb_url = config('blast.storybook_server_url');

    $sb_route = $sb_route =
        parse_url($sb_url, PHP_URL_PATH) ?: '/storybook_preview';

    Route::get($sb_route, function () {
        return abort(403, 'To access blast go to localhost:6006');
    });

    Route::get($sb_route . '/{name?}', StoryController::class)->where(
        'name',
        '.*',
    );
}
