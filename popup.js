/**
 * STFU Popup Script
 * Handles UI interactions for managing URL prefixes
 */

// DOM elements
const newPrefixInput = document.getElementById("newPrefix");
const addButton = document.getElementById("addButton");
const addCurrentButton = document.getElementById("addCurrentButton");
const prefixList = document.getElementById("prefixList");

/**
 * Loads and displays all prefixes from storage
 */
async function loadPrefixes() {
  const data = await browser.storage.local.get("prefixes");
  const prefixes = data.prefixes || [];

  if (prefixes.length === 0) {
    prefixList.innerHTML =
      '<p class="empty-message">No URL prefixes added yet.</p>';
    return;
  }

  // Sort prefixes alphabetically
  prefixes.sort((a, b) => a.url.localeCompare(b.url));

  prefixList.innerHTML = "";

  prefixes.forEach((prefix, index) => {
    const item = createPrefixItem(prefix, index);
    prefixList.appendChild(item);
  });
}

/**
 * Creates a DOM element for a prefix item
 * @param {Object} prefix - The prefix object {url, enabled}
 * @param {number} index - The index in the array
 * @returns {HTMLElement} The prefix item element
 */
function createPrefixItem(prefix, index) {
  const item = document.createElement("div");
  item.className = "prefix-item";

  // Toggle checkbox
  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.className = "prefix-toggle";
  toggle.checked = prefix.enabled;
  toggle.addEventListener("change", () => togglePrefix(index));

  // URL label
  const label = document.createElement("span");
  label.className = "prefix-url";
  label.textContent = prefix.url;
  label.title = prefix.url;

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "×";
  deleteBtn.title = "Remove prefix";
  deleteBtn.addEventListener("click", () => deletePrefix(index));

  item.appendChild(toggle);
  item.appendChild(label);
  item.appendChild(deleteBtn);

  return item;
}

/**
 * Adds a new prefix to storage
 * @param {string} url - The URL prefix to add
 */
async function addPrefix(url) {
  // Validate and normalize URL
  url = url.trim();

  if (!url) {
    showMessage("Please enter a URL prefix", "error");
    return;
  }

  // Ensure URL has a protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    showMessage("Invalid URL format", "error");
    return;
  }

  const data = await browser.storage.local.get("prefixes");
  const prefixes = data.prefixes || [];

  // Check for duplicates
  if (prefixes.some((p) => p.url === url)) {
    showMessage("This prefix already exists", "error");
    return;
  }

  // Add new prefix (enabled by default)
  prefixes.push({ url, enabled: true });

  await browser.storage.local.set({ prefixes });

  // Clear input and reload list
  newPrefixInput.value = "";
  await loadPrefixes();

  showMessage("Prefix added successfully", "success");

  // Notify background script to refresh tabs
  browser.runtime.sendMessage({ action: "refreshTabs" });
}

/**
 * Toggles the enabled state of a prefix
 * @param {number} index - The index of the prefix to toggle
 */
async function togglePrefix(index) {
  const data = await browser.storage.local.get("prefixes");
  const prefixes = data.prefixes || [];

  if (prefixes[index]) {
    prefixes[index].enabled = !prefixes[index].enabled;
    await browser.storage.local.set({ prefixes });

    // Notify background script to refresh tabs
    browser.runtime.sendMessage({ action: "refreshTabs" });
  }
}

/**
 * Deletes a prefix from storage
 * @param {number} index - The index of the prefix to delete
 */
async function deletePrefix(index) {
  const data = await browser.storage.local.get("prefixes");
  const prefixes = data.prefixes || [];

  if (prefixes[index]) {
    prefixes.splice(index, 1);
    await browser.storage.local.set({ prefixes });
    await loadPrefixes();

    showMessage("Prefix removed", "success");

    // Notify background script to refresh tabs
    browser.runtime.sendMessage({ action: "refreshTabs" });
  }
}

/**
 * Adds the current tab's origin as a prefix
 */
async function addCurrentTab() {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tabs.length === 0) {
      showMessage("No active tab found", "error");
      return;
    }

    const tab = tabs[0];

    if (
      !tab.url ||
      tab.url.startsWith("about:") ||
      tab.url.startsWith("moz-extension:")
    ) {
      showMessage("Cannot add this type of page", "error");
      return;
    }

    // Extract origin (protocol + hostname)
    const url = new URL(tab.url);
    const origin = url.origin;

    await addPrefix(origin);
  } catch (error) {
    console.error("Error adding current tab:", error);
    showMessage("Error adding current tab", "error");
  }
}

/**
 * Shows a temporary message to the user
 * @param {string} text - The message text
 * @param {string} type - The message type ('success' or 'error')
 */
function showMessage(text, type) {
  // Remove any existing message
  const existing = document.querySelector(".message");
  if (existing) {
    existing.remove();
  }

  const message = document.createElement("div");
  message.className = `message message-${type}`;
  message.textContent = text;

  document
    .querySelector(".container")
    .insertBefore(message, document.querySelector(".add-section"));

  // Remove after 3 seconds
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Event listeners
addButton.addEventListener("click", () => {
  addPrefix(newPrefixInput.value);
});

newPrefixInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addPrefix(newPrefixInput.value);
  }
});

addCurrentButton.addEventListener("click", addCurrentTab);

// Load prefixes when popup opens
loadPrefixes();
