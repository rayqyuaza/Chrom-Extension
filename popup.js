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

