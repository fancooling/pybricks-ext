import { FileStorageDb } from "./filestorage";

const saveAllFiles = async () => {
  try {
    const db = new FileStorageDb("pybricks.fileStorage");
    // Assuming the file object has `path` and `content` properties.
    const allFiles = await db._contents.toArray();

    if (allFiles.length === 0) {
      console.log("No files to save.");
      alert("No files to save.");
      return;
    }

    // Use the File System Access API to select a directory
    const dirHandle = await window.showDirectoryPicker();

    // Iterate over each file and save it to the selected directory
    for (const file of allFiles) {
      const fileName = file.path;

      if (!fileName) continue;

      const fileHandle = await dirHandle.getFileHandle(fileName, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(file.contents); // Assuming file.content is a Blob, string, or BufferSource
      await writable.close();
      console.log(`Saved: ${file.path}`);
    }

    console.log("All files saved successfully.");
    alert("All files saved successfully!");
  } catch (err) {
    // The user aborting the file picker is a valid scenario, so we check for it.
    if (err instanceof DOMException && err.name === "AbortError") {
      console.log("User cancelled the directory selection.");
    } else {
      console.error("Error saving files:", err);
      const message = err instanceof Error ? err.message : String(err);
      alert(`An error occurred while saving files: ${message}`);
    }
  }
};

const createAndInsertButton = (
  selector: string,
  newId: string,
  newTitle: string,
  iconPath: string,
  onClickHandler: () => void
) => {
  const existingButton = document.querySelector<HTMLButtonElement>(selector);

  if (existingButton) {
    const newButton = existingButton.cloneNode(true) as HTMLButtonElement;
    newButton.id = newId;
    newButton.title = newTitle;

    newButton.innerHTML = "";
    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL(iconPath);
    icon.alt = newTitle;
    icon.style.width = "16px";
    icon.style.height = "16px";
    newButton.appendChild(icon);

    newButton.onclick = onClickHandler;

    existingButton.parentNode?.insertBefore(
      newButton,
      existingButton
    );
    return newButton;
  } else {
    console.error(`Button with selector "${selector}" not found.`);
    return null;
  }
};

const initializeExtension = async () => {
  const currentUrl = window.location.href;
  console.log(`Content script running on: ${currentUrl}`);

  // Add a new "save all" button next to the archive button. It is
  // different from archive button in that it saves all pybricks files in
  // plain python source code to the directory selected by the user, instead
  // of a zip file.
  createAndInsertButton(
    "#pb-explorer-archive-button",
    "pb-explorer-save-all-button",
    "Save all files",
    "images/cloud-download.svg",
    saveAllFiles
  );
};

// The 'load' event fires when the whole page has loaded, including all
// dependent resources such as stylesheets and images.
window.addEventListener("load", initializeExtension);
