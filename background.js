/**
 * STFU Background Script
 * Monitors tabs and automatically mutes those matching configured URL prefixes
 */

// Initialize storage with default structure if needed
browser.runtime.onInstalled.addListener(async () => {
  const data = await browser.storage.local.get("prefixes");
  if (!data.prefixes) {
    await browser.storage.local.set({ prefixes: [] });
  }
  // Check all existing tabs on install
  await checkAllTabs();
});

/**
 * Retrieves all enabled URL prefixes from storage
 * @returns {Promise<string[]>} Array of enabled URL prefixes
 */
async function getEnabledPrefixes() {
  const data = await browser.storage.local.get("prefixes");
  const prefixes = data.prefixes || [];
  return prefixes.filter((p) => p.enabled).map((p) => p.url);
}

/**
 * Checks if a URL matches any of the enabled prefixes
 * @param {string} url - The URL to check
 * @param {string[]} prefixes - Array of URL prefixes
 * @returns {boolean} True if URL matches any prefix
 */
function urlMatchesPrefix(url, prefixes) {
  if (!url) return false;
  return prefixes.some((prefix) => url.startsWith(prefix));
}

/**
 * Mutes or unmutes a tab based on whether its URL matches enabled prefixes
 * @param {number} tabId - The ID of the tab to process
 * @param {string} url - The URL of the tab
 */
async function processTab(tabId, url) {
  try {
    const enabledPrefixes = await getEnabledPrefixes();
    const shouldMute = urlMatchesPrefix(url, enabledPrefixes);

    // Get current tab state
    const tab = await browser.tabs.get(tabId);

    // Only update if the muted state needs to change
    if (tab.mutedInfo && tab.mutedInfo.muted !== shouldMute) {
      await browser.tabs.update(tabId, { muted: shouldMute });
    }
  } catch (error) {
    // Tab might have been closed, ignore errors
    console.debug("Error processing tab:", error);
  }
}

/**
 * Checks all open tabs and applies muting rules
 */
async function checkAllTabs() {
  try {
    const tabs = await browser.tabs.query({});
    const enabledPrefixes = await getEnabledPrefixes();

    for (const tab of tabs) {
      if (tab.url) {
        const shouldMute = urlMatchesPrefix(tab.url, enabledPrefixes);
        if (tab.mutedInfo && tab.mutedInfo.muted !== shouldMute) {
          await browser.tabs.update(tab.id, { muted: shouldMute });
        }
      }
    }
  } catch (error) {
    console.error("Error checking all tabs:", error);
  }
}

// Listen for tab updates (URL changes, page loads, etc.)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process when URL is available
  if (changeInfo.url || changeInfo.status === "complete") {
    processTab(tabId, tab.url);
  }
});

// Listen for new tabs being created
browser.tabs.onCreated.addListener((tab) => {
  if (tab.url) {
    processTab(tab.id, tab.url);
  }
});

// Listen for storage changes to immediately apply new rules
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.prefixes) {
    // Prefixes changed, recheck all tabs
    checkAllTabs();
  }
});

// Handle messages from popup (for immediate refresh if needed)
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "refreshTabs") {
    return checkAllTabs();
  }
});
