# STFU - Smart Tab Muting

![STFU, please](./icons/icon-96.png)

_STFU_ is a Firefox extension that automatically mutes tabs from websites you specify. Tired of noisy autoplay videos,
ads, or social media sounds? Add a URL prefix and never hear from that site again.

## Features

- **Automatic Muting**: Tabs matching your URL prefixes are muted instantly
- **Simple Management**: Easy-to-use interface for adding, removing, and toggling URL prefixes
- **Quick Add**: One-click button to mute the current tab's website
- **Toggle Control**: Enable or disable prefixes without removing them
- **Real-time Updates**: Changes apply immediately to all open tabs
- **Default Enabled**: New prefixes are active by default

## How It Works

The extension monitors all tabs and automatically mutes any tab whose URL starts with one of your configured prefixes.
Both existing tabs and newly opened tabs are checked. You can toggle prefixes on or off, and changes take effect
immediately.

## Installation

See [INSTALL.md](INSTALL.md) for complete installation instructions, including:
- How to load the extension in Firefox
- Creating a distributable .xpi package
- Usage examples and troubleshooting

## Quick Start

1. Load the extension in Firefox (see [INSTALL.md](INSTALL.md))
2. Click the STFU icon in your toolbar
3. Add URL prefixes (e.g., `https://youtube.com/`)
4. Watch tabs get muted automatically!

_Note: This extension was vibe coded in 10 minutes with AI assistance. It works surprisingly well._