# Blast Custom Doc Blocks Integration

This document outlines the architecture, features, and usage of the modular Vanilla JavaScript Doc Blocks implemented in this Blast fork. This architecture replicates Storybook's official Doc Blocks (Canvas, Controls, Source, IconGallery, etc.) using a lightweight Regex-parsing engine without relying on React, fully optimized for Laravel 11.

## 1. Architectural Overview

The system is divided into three main layers:

**1. Frontend Parsing Engine:** A collection of modular Vanilla JS parsers located in `resources/frontend/js/doc-blocks/`.

**2. The Orchestrator:** The `index.js` file that chains the parsing pipeline and DOM interactivity.

**3. Preview Configuration:** The `.storybook/preview.js` file which supplies the global context (Args, ArgTypes, Source Code) to the Orchestrator.

### Directory Structure

```text
blast-stable-windows-support/
├── resources/
│   └── frontend/
│       └── js/
│           ├── styles.js              # Defensive CSS for doc blocks
│           └── doc-blocks/            # Modular Parsers
│               ├── index.js           # The Orchestrator
│               ├── helpers.js         # HTML escaping & formatting
│               ├── Canvas.js          # [render-canvas:...]
│               ├── Controls.js        # [render-controls]
│               ├── IconGallery.js     # [render-icongallery:...]
│               ├── Source.js          # [render-source]
│               ├── Story.js           # [render-story:...]
│               └── Typography.js      # [render-title], [render-description]
├── src/
│   └── Commands/
│       └── GenerateIcons.php          # Backend CSS Scanner for IconGallery
└── tests/
    ├── E2E/                           # Playwright DOM Integration Tests
    ├── Feature/                       # PHPUnit tests for Artisan Commands
    └── Javascript/                    # Jest Unit Tests for JS Modules

```

## 2. Available Macros & Usage Guide

You can use the following macros directly inside your Markdown (README.md) files to render interactive documentation components.

**A. Typography**

Renders static textual information extracted from the component's .stories.json metadata.

    `[render-title]` : Renders an `<h1>` containing the Story name.

    `[render-subtitle]` : Renders an `<h3>` subtitle.

    `[render-description]` : Renders a `<p>` containing the component's description.

**B. Canvas & Story**

Renders the actual Blade component inside an isolated iframe.

    Canvas: Renders the iframe wrapped in a full UI with Zoom controls and a collapsible Source Code block. You can pass custom arguments dynamically.

        Usage: `[render-canvas:variant:primary;is-circle:true]`

        Usage (Default Args): [render-canvas:]

    Story: Renders a pure iframe without the toolbar or action bar.

        Usage: `[render-story:variant:outline]`

**C. Controls (ArgTypes)**

Renders an interactive table that allows users to manipulate the component's arguments in real-time. Modifying a control automatically updates the URL of all rendered Canvas/Story iframes on the page.

    Usage: `[render-controls]` or `[render-argtypes]`

**D. Source**

Renders a standalone, syntax-highlighted code block containing the formatted Blade snippet of the component, complete with a "Copy" button.

    Usage: `[render-source]`

## 3. Icon Gallery & Asset Generator

The Icon Gallery module asynchronously fetches a JSON manifest of icons and renders a responsive grid with a click-to-copy feature for the HTML snippet (e.g., `<i class="ki-duotone ki-user"></i>`).

**Step 1: Generate the JSON Manifest (Backend)**

Instead of manually maintaining thousands of icons, use the built-in Artisan command to scan the Metronic Keenicons CSS file and generate the JSON payload automatically.

Basic Usage:

```code
php artisan blast:generate-icons
```

(Defaults to scanning public/assets/plugins/global/plugins.bundle.css and outputting to public/assets/keenicons.json).

**Custom Paths:**

```code

php artisan blast:generate-icons --source="public/css/metronic/style.css" --output="public/docs/keenicons.json"

```

**Step 2: Render in Markdown (Frontend)**

Point the macro to the publicly accessible JSON file generated in Step 1.

    Usage: [render-icongallery: /assets/keenicons.json]

## 4. Testing Pipeline

The architecture is fully protected by automated tests across both frontend and backend environments. Ensure all tests pass before submitting a Pull Request.

**Unit Testing (Frontend - Jest)**

Validates the Regular Expressions, code formatting logic, and modular HTML generation without spinning up a browser.

```code

npm run test:js

```

**End-to-End Testing (Frontend - Playwright)**

Validates DOM interactivity (Zooming, Toggling Code, Reactive URL updates via Controls, and Iframe isolation) across Chromium, Firefox, and WebKit.
Note: Ensure the local Storybook server is running (php artisan blast:launch) before executing this test.

```code

npm run test:e2e

```

**Feature Testing (Backend - PHPUnit)**

Validates the Icon Generator console command, ensuring duplicates are removed and proper JSON structures are created using temporary mock CSS files.

```code

./vendor/bin/phpunit tests/Feature/GenerateIconsTest.php

```

## 5. Real-world Usage Example

Below is a practical example of how a developer might write a button.README.md file using these macros.

```md
[render-title]
[render-subtitle]

[render-description]

## Interactive Playground

Explore the component using the controls below. The code block will automatically update based on your configurations.

[render-canvas:]

### Component Properties

[render-controls]

---

## Variants

### Outline Button

Use the outline variant for secondary actions that shouldn't compete with the primary button.
[render-canvas:variant:outline]

### Destructive Button

Use this variant for actions that result in data loss or unrecoverable states.
[render-canvas:variant:destructive]

---

## Available Icons

You can pair the button with any of the following icons. Click an icon to copy its snippet.

[render-icongallery: /assets/keenicons.json]
```
