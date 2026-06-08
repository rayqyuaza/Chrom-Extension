// popup.js
// Handles popup interactions and evidence storage
document.addEventListener("DOMContentLoaded", function () {
    var highlightedTextDiv = document.getElementById("highlightedText");
    var saveEvidenceBtn = document.getElementById("saveEvidenceBtn");
    var clearBtn = document.getElementById("clearBtn");
    var evidenceList = document.getElementById("evidenceList");
    var clearAllBtn = document.getElementById("clearAllBtn");
    var openLibraryBtn = document.getElementById("openLibraryBtn");
    var notesInput = document.getElementById("notesInput");
    var tagSelect = document.getElementById("tagSelect");
    var customTagInput = document.getElementById("customTagInput");
    var addTagBtn = document.getElementById("addTagBtn");
    var createTagBtn = document.getElementById("createTagBtn");
    var selectedTagsDiv = document.getElementById("selectedTags");
    var highlightTab = document.getElementById("highlightTab");
    var evidenceTab = document.getElementById("evidenceTab");
    var highlightContent = document.getElementById("highlightContent");
    var evidenceContent = document.getElementById("evidenceContent");
    var currentSelectedTags = [];
    // --------------------------
    // TAB SWITCHING
    // --------------------------
    highlightTab.addEventListener("click", function () {
        highlightTab.classList.add("active");
        evidenceTab.classList.remove("active");
        highlightContent.classList.add("active");
        evidenceContent.classList.remove("active");
    });
    evidenceTab.addEventListener("click", function () {
        evidenceTab.classList.add("active");
        highlightTab.classList.remove("active");
        evidenceContent.classList.add("active");
        highlightContent.classList.remove("active");
        loadSavedEvidence();
    });
    // --------------------------
    // LOAD HIGHLIGHTED TEXT
    // --------------------------
    function loadHighlightedText() {
        chrome.storage.local.get("lastHighlightedText", function (result) {
            if (result.lastHighlightedText) {
                highlightedTextDiv.textContent =
                    result.lastHighlightedText;
                highlightedTextDiv.classList.remove("empty-state");
            } else {
                highlightedTextDiv.textContent =
                    "Highlight text on a webpage to see it here...";
                highlightedTextDiv.classList.add("empty-state");
            }
        });
    }
    // --------------------------
    // LOAD TAGS
    // --------------------------
    function loadAvailableTags() {
        chrome.storage.local.get("availableTags", function (result) {
            var tags = result.availableTags;
            if (!tags) {
                tags = ["NEG", "AFF"];
            }
            tagSelect.innerHTML = "";
            var defaultOption =
                document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent =
                "-- Select or Create Tag --";
            tagSelect.appendChild(defaultOption);
            for (var i = 0; i < tags.length; i++) {
                var option =
                    document.createElement("option");
                option.value = tags[i];
                option.textContent = tags[i];
                tagSelect.appendChild(option);
            }
        });
    }
    // --------------------------
    // DISPLAY TAGS
    // --------------------------
    function displaySelectedTags() {
        selectedTagsDiv.innerHTML = "";
        for (var i = 0; i < currentSelectedTags.length; i++) {
            var tagSpan =
                document.createElement("span");
            tagSpan.className = "tag-badge";
            tagSpan.textContent =
                currentSelectedTags[i] + " ✕";
            tagSpan.setAttribute(
                "onclick",
                "removeTag('" +
                currentSelectedTags[i] +
                "')"
            );
            selectedTagsDiv.appendChild(tagSpan);
        }
    }
    // --------------------------
    // ADD TAG
    // --------------------------
    addTagBtn.addEventListener("click", function () {
        var selectedTag = tagSelect.value;
        if (selectedTag == "") {
            return;
        }
        var alreadyExists = false;
        for (var i = 0; i < currentSelectedTags.length; i++) {
            if (currentSelectedTags[i] == selectedTag) {
                alreadyExists = true;
            }
        }
        if (alreadyExists == false) {
            currentSelectedTags.push(selectedTag);
            displaySelectedTags();
            tagSelect.value = "";
        }
    });
    // --------------------------
    // CREATE TAG
    // --------------------------
    createTagBtn.addEventListener("click", function () {
        var newTag =
            customTagInput.value.trim();
        if (newTag == "") {
            return;
        }
        chrome.storage.local.get(
            "availableTags",
            function (result) {
                var tags = result.availableTags;
                if (!tags) {
                    tags = ["NEG", "AFF"];
                }
                var exists = false;
                for (var i = 0; i < tags.length; i++) {
                    if (tags[i] == newTag) {
                        exists = true;
                    }
                }
                if (exists) {
                    alert("Tag already exists!");
                } else {
                    tags.push(newTag);
                    chrome.storage.local.set(
                        { availableTags: tags },
                        function () {
                            loadAvailableTags();
                            var tagExists = false;
                            for (
                                var j = 0;
                                j < currentSelectedTags.length;
                                j++
                            ) {
                                if (
                                    currentSelectedTags[j]
                                    == newTag
                                ) {
                                    tagExists = true;
                                }
                            }
                            if (!tagExists) {
                                currentSelectedTags.push(
                                    newTag
                                );
                            }
                            displaySelectedTags();
                            customTagInput.value = "";
                        }
                    );
                }
            }
        );
    });
    // --------------------------
    // REMOVE TAG
    // --------------------------
    window.removeTag = function (tag) {
        var newTagArray = [];
        for (
            var i = 0;
            i < currentSelectedTags.length;
            i++
        ) {
            if (
                currentSelectedTags[i] != tag
            ) {
                newTagArray.push(
                    currentSelectedTags[i]
                );
            }
        }
        currentSelectedTags = newTagArray;
        displaySelectedTags();
    };
  // popup.js - Handles popup interactions and evidence storage with tags and notes
document.addEventListener('DOMContentLoaded', () => {
  const highlightedTextDiv = document.getElementById('highlightedText');
  const saveEvidenceBtn = document.getElementById('saveEvidenceBtn');
  const clearBtn = document.getElementById('clearBtn');
  const evidenceList = document.getElementById('evidenceList');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const openLibraryBtn = document.getElementById('openLibraryBtn');
  const notesInput = document.getElementById('notesInput');
  
  // Tag elements
  const tagSelect = document.getElementById('tagSelect');
  const customTagInput = document.getElementById('customTagInput');
  const addTagBtn = document.getElementById('addTagBtn');
  const createTagBtn = document.getElementById('createTagBtn');
  const selectedTagsDiv = document.getElementById('selectedTags');
  
  // Tab switching
  const highlightTab = document.getElementById('highlightTab');
  const evidenceTab = document.getElementById('evidenceTab');
  const highlightContent = document.getElementById('highlightContent');
  const evidenceContent = document.getElementById('evidenceContent');

  let currentSelectedTags = [];

  highlightTab.addEventListener('click', () => {
    highlightTab.classList.add('active');
    evidenceTab.classList.remove('active');
    highlightContent.classList.add('active');
    evidenceContent.classList.remove('active');
  });

  evidenceTab.addEventListener('click', () => {
    evidenceTab.classList.add('active');
    highlightTab.classList.remove('active');
    evidenceContent.classList.add('active');
    highlightContent.classList.remove('active');
    loadSavedEvidence();
  });

  // Load current highlighted text
  function loadHighlightedText() {
    chrome.storage.local.get('lastHighlightedText', (result) => {
      if (result.lastHighlightedText) {
        highlightedTextDiv.textContent = result.lastHighlightedText;
        highlightedTextDiv.classList.remove('empty-state');
      } else {
        highlightedTextDiv.textContent = 'Highlight text on a webpage to see it here...';
        highlightedTextDiv.classList.add('empty-state');
      }
    });
  }

  // Load available tags into dropdown
  function loadAvailableTags() {
    chrome.storage.local.get('availableTags', (result) => {
      const tags = result.availableTags || ['NEG', 'AFF'];
      
      // Clear and rebuild dropdown
      tagSelect.innerHTML = '<option value="">-- Select or Create Tag --</option>';
      tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
      });
    });
  }

  // Add tag from dropdown
  addTagBtn.addEventListener('click', () => {
    const selectedTag = tagSelect.value;
    if (selectedTag && !currentSelectedTags.includes(selectedTag)) {
      currentSelectedTags.push(selectedTag);
      displaySelectedTags();
      tagSelect.value = '';
    }
  });

  // Create custom tag
  createTagBtn.addEventListener('click', () => {
    const newTag = customTagInput.value.trim();
    if (newTag) {
      chrome.storage.local.get('availableTags', (result) => {
        const tags = result.availableTags || ['NEG', 'AFF'];
        if (!tags.includes(newTag)) {
          tags.push(newTag);
          chrome.storage.local.set({ availableTags: tags }, () => {
            loadAvailableTags();
            if (!currentSelectedTags.includes(newTag)) {
              currentSelectedTags.push(newTag);
              displaySelectedTags();
            }
            customTagInput.value = '';
          });
        } else {
          alert('Tag already exists!');
        }
      });
    }
  });

  // Display selected tags with remove option
  function displaySelectedTags() {
    selectedTagsDiv.innerHTML = currentSelectedTags.map(tag => 
      `<span class="tag-badge" onclick="removeTag('${tag}')">${tag} ✕</span>`
    ).join('');
  }

  // Remove tag from selection
  window.removeTag = function(tag) {
    currentSelectedTags = currentSelectedTags.filter(t => t !== tag);
    displaySelectedTags();
  };

  // Load and display saved evidence
  function loadSavedEvidence() {
    chrome.storage.local.get('savedEvidence', (result) => {
      const evidence = result.savedEvidence || [];
      
      if (evidence.length === 0) {
        evidenceList.innerHTML = '<p style="color: #999; text-align: center;">No saved evidence yet</p>';
        return;
      }

      evidenceList.innerHTML = evidence.map((item, index) => `
        <div class="saved-evidence">
          <div class="saved-evidence-title">📌 ${escapeHtml(item.pageTitle)}</div>
          <div class="saved-evidence-quote">"${escapeHtml(item.quote)}"</div>
          ${item.notes ? `<div style="background-color: #f0f0f0; padding: 8px; border-radius: 4px; margin: 8px 0; font-size: 11px; color: #666;">📝 ${escapeHtml(item.notes)}</div>` : ''}
          <div class="evidence-tags">
            ${(item.tags || []).map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
          </div>
          <div class="saved-evidence-meta">
            <div>🔗 <a href="${escapeHtml(item.url)}" target="_blank" style="color: #0066cc; text-decoration: none;">View Source</a></div>
            <div>⏰ ${new Date(item.timestamp).toLocaleString()}</div>
          </div>
          <button class="danger" style="margin-top: 8px; padding: 5px 10px; font-size: 12px;" onclick="deleteEvidence(${index})">Delete</button>
        </div>
      `).join('');
    });
  }

  // Escape HTML
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Delete specific evidence
  window.deleteEvidence = function(index) {
    chrome.storage.local.get('savedEvidence', (result) => {
      const evidence = result.savedEvidence || [];
      evidence.splice(index, 1);
      chrome.storage.local.set({ savedEvidence: evidence }, () => {
        loadSavedEvidence();
      });
    });
  };

  // Save evidence with tags and notes
  saveEvidenceBtn.addEventListener('click', () => {
    const quote = highlightedTextDiv.textContent;
    
    if (quote && quote !== 'Highlight text on a webpage to see it here...') {
      if (currentSelectedTags.length === 0) {
        alert('Please add at least one tag before saving!');
        return;
      }

      // Get page info from current tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const pageUrl = tabs[0].url;
        const pageTitle = tabs[0].title;
        const timestamp = new Date().toISOString();
        const notes = notesInput.value.trim();

        // Save to evidence list
        chrome.storage.local.get('savedEvidence', (result) => {
          const evidence = result.savedEvidence || [];
          evidence.push({
            quote: quote,
            pageTitle: pageTitle,
            url: pageUrl,
            timestamp: timestamp,
            tags: [...currentSelectedTags],
            notes: notes
          });

          chrome.storage.local.set({ savedEvidence: evidence }, () => {
            saveEvidenceBtn.textContent = 'Saved! ✓';
            setTimeout(() => {
              saveEvidenceBtn.textContent = 'Save as Evidence';
            }, 2000);

            // Reset tags and notes
            currentSelectedTags = [];
            displaySelectedTags();
            notesInput.value = '';
          });
        });
      });
    }
  });

  // Clear current highlight
  clearBtn.addEventListener('click', () => {
    chrome.storage.local.set({ lastHighlightedText: '' }, () => {
      highlightedTextDiv.textContent = 'Highlight text on a webpage to see it here...';
      highlightedTextDiv.classList.add('empty-state');
      currentSelectedTags = [];
      displaySelectedTags();
      notesInput.value = '';
    });
  });

  // Clear all evidence
  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all saved evidence?')) {
      chrome.storage.local.set({ savedEvidence: [] }, () => {
        loadSavedEvidence();
      });
    }
  });

  // Open library
  openLibraryBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('library.html') });
  });

  // Load on startup
  loadHighlightedText();
  loadAvailableTags();

  // Listen for messages from content script when text is highlighted
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'textHighlighted') {
      loadHighlightedText();
    }
  });
});
