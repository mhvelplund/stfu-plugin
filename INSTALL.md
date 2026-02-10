# STFU Installation Guide

## Loading the Extension in Firefox

### Method 1: Temporary Installation (for testing)

1. Open Firefox and navigate to `about:debugging`
2. Click on "This Firefox" in the left sidebar
3. Click the "Load Temporary Add-on..." button
4. Navigate to the `stfu` folder and select the `manifest.json` file
5. The extension will be loaded and active until you close Firefox

### Method 2: Permanent Installation (unsigned)

For development/personal use, you can disable signature verification:

1. Open Firefox and navigate to `about:config`
2. Accept the warning if prompted
3. Search for `xpinstall.signatures.required`
4. Set it to `false` (double-click to toggle)
5. Navigate to `about:addons`
6. Click the gear icon and select "Install Add-on From File..."
7. Select the extension folder or create a `.xpi` file (see below)

### Method 3: Creating a .xpi Package

To create a distributable package:

1. Open a terminal/command prompt
2. Navigate to the parent directory of the `stfu` folder
3. Run: `cd stfu && zip -r ../stfu.xpi * && cd ..`
   - On Windows (PowerShell): `Compress-Archive -Path stfu\* -DestinationPath stfu.xpi`
4. Install the resulting `stfu.xpi` file via `about:addons`

## Using the Extension

### Adding URL Prefixes

1. Click the STFU icon in your Firefox toolbar
2. Enter a URL prefix (e.g., `https://youtube.com/`)
3. Click "Add Prefix" or press Enter
4. The prefix is now active and will mute matching tabs

### Quick Add Current Tab

1. Navigate to any website you want to mute
2. Click the STFU icon
3. Click "Add Current Tab"
4. The site's origin (e.g., `https://example.com`) will be added

### Managing Prefixes

- **Toggle On/Off**: Click the checkbox next to a prefix to enable/disable it
- **Remove**: Click the × button to delete a prefix
- **View All**: All prefixes are listed in the popup

### How It Works

- When a tab's URL matches an **enabled** prefix, it will be automatically muted
- Both existing tabs and newly opened tabs are checked
- Changes take effect immediately
- Disabling a prefix will unmute matching tabs
- Removing a prefix will unmute matching tabs

## Troubleshooting

### Extension Not Working

1. Check that the extension is enabled in `about:addons`
2. Verify permissions are granted (tabs, storage, access to all websites)
3. Reload the extension by clicking the reload button in `about:debugging`

### Tabs Not Being Muted

1. Ensure the prefix exactly matches the beginning of the URL
2. Check that the prefix is **enabled** (checkbox is checked)
3. Try adding the site's origin (e.g., `https://site.com`) instead of a specific path

### Icons Missing

The extension references icon files that need to be created:
- `icons/icon-48.png` (48x48 pixels)
- `icons/icon-96.png` (96x96 pixels)

You can either:
1. Create your own icons and place them in an `icons/` folder
2. Or remove the icon references from `manifest.json` (Firefox will use a default icon)

## URL Prefix Examples

- `https://youtube.com/` - Mutes all YouTube pages
- `https://twitter.com/` - Mutes all Twitter/X pages
- `https://reddit.com/r/videos/` - Mutes only a specific subreddit
- `http://localhost:3000/` - Mutes local development servers
- `https://news.ycombinator.com/` - Mutes Hacker News

## Permissions Explained

- **tabs**: Required to access tab information and mute/unmute tabs
- **storage**: Required to save your list of URL prefixes
- **<all_urls>**: Required to check tab URLs against your prefix list

## Firefox Version Requirements

- Minimum Firefox version: 57.0 (Firefox Quantum)
- Tested on Firefox 115+ (latest ESR and stable releases)
