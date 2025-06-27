import axios from 'axios';
import { URL } from 'url';
import { validateUrl } from '../../utils/urlValidator';

// Simple rate limiting (in-memory for serverless)
const requestCounts = new Map();
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_REQUESTS || '100');
const RATE_WINDOW = 60 * 1000; // 1 minute

// Restore admin sidebar definition (no demo banner)
const adminSidebar = `
  <style>
    #admin-sidebar {
      position: fixed !important;
      top: 64px !important;
      right: 0 !important;
      width: 320px !important;
      height: calc(100vh - 64px) !important;
      background: #f7f7f8 !important;
      border-left: 1px solid #e0e0e0 !important;
      box-shadow: none !important;
      padding: 20px 16px 36px 16px !important;
      font-family: 'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      z-index: 999998 !important;
      display: flex !important;
      flex-direction: column !important;
      transition: transform 0.3s ease, width 0.3s ease !important;
      border-width: 0 2px 2px 2px !important;
      border-style: solid !important;
      border-color: transparent !important;
      background-image: linear-gradient(#f7f7f8, #f7f7f8), linear-gradient(60deg, #FF8C42, #4B9FE1, #8860D0) !important;
      background-origin: border-box !important;
      background-clip: padding-box, border-box !important;
      overflow-y: auto !important;
    }
    #admin-sidebar.minimized {
      transform: translateX(100%) !important;
    }
    #admin-sidebar .sidebar-toggle-btn {
      position: absolute !important;
      left: -20px !important;
      top: 50% !important;
      transform: translateY(-50%);
      z-index: 1000001 !important;
      width: 40px !important;
      height: 40px !important;
      background: #e5e7eb !important;
      color: #666 !important;
      border: 1px solid #d1d5db !important;
      border-radius: 50% !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: background 0.2s, color 0.2s, left 0.3s !important;
      border: 2px solid transparent !important;
      background-image: linear-gradient(#e5e7eb, #e5e7eb), linear-gradient(60deg, #FF8C42, #4B9FE1, #8860D0) !important;
      background-origin: border-box !important;
      background-clip: padding-box, border-box !important;
    }
    #admin-sidebar.minimized .sidebar-toggle-btn {
      left: -20px !important;
    }
    #admin-sidebar .sidebar-toggle-btn:hover {
      background: #d1d5db !important;
      color: #333 !important;
    }
    #admin-sidebar .sidebar-toggle-btn svg {
      width: 22px !important;
      height: 22px !important;
      display: block !important;
    }
    .admin-header {
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 18px 0;
      padding: 32px 16px 0 16px;
      color: #222;
      letter-spacing: 0.01em;
    }
    .divider {
      border-bottom: 1px solid #e0e0e0;
      margin: 24px 0 18px 0;
      width: 100%;
    }
    .section-label {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 10px;
      margin-top: 0;
      display: block;
    }
    .slider-section {
      padding: 0 16px 0 16px;
      margin-bottom: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .slider-label {
      font-size: 15px;
      color: #333;
      margin-bottom: 6px;
    }
    .size-btn-group {
      display: flex;
      flex-direction: row;
      gap: 12px;
      width: 100%;
    }
    .size-btn {
      flex: 1;
      min-width: 60px;
      padding: 10px 0;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: background 0.2s, color 0.2s, border 0.2s;
      text-align: center;
    }
    .size-btn.selected, .size-btn:active {
      background: #6366f1;
      color: #fff;
      border-color: #6366f1;
    }
    .size-btn:not(.selected):hover {
      background: #f1f1f9;
      color: #333;
    }
    .style-section {
      padding: 0 16px 0 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .style-toggle-group {
      display: flex;
      gap: 12px;
    }
    .style-toggle {
      flex: 1;
      padding: 10px 0;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: background 0.2s, color 0.2s, border 0.2s;
      text-align: center;
    }
    .style-toggle.selected, .style-toggle:active {
      background: #6366f1;
      color: #fff;
      border-color: #6366f1;
    }
    .style-toggle:not(.selected):hover {
      background: #f1f1f9;
      color: #333;
    }
    .collapsible-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      padding: 0 16px 0 16px;
      font-size: 18px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px !important;
      margin-top: 8px;
      user-select: none;
      min-height: 48px;
      height: 48px;
      box-sizing: border-box;
    }
    .collapsible-header svg {
      width: 22px;
      height: 22px;
      transition: transform 0.2s;
    }
    .collapsible-header.open svg {
      transform: rotate(90deg);
    }
    .collapsible-content, .collapsible-content.open {
      padding: 0 16px 16px 16px;
      display: none;
      margin-top: 8px !important;
    }
    .collapsible-content.open {
      display: block;
    }
    .source-toggle {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      cursor: pointer;
      user-select: none;
      font-size: 16px;
      color: #333;
    }
    .toggle-switch {
      position: relative;
      width: 36px;
      height: 22px;
      background: #e4e4e4;
      border-radius: 8px;
      margin-right: 10px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .toggle-switch::before {
      content: "";
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      top: 2px;
      left: 2px;
      transition: transform 0.2s;
      box-shadow: none;
    }
    .source-toggle input:checked + .toggle-switch {
      background: #6366f1;
    }
    .source-toggle input:checked + .toggle-switch::before {
      transform: translateX(12px);
    }
    .source-toggle input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    .source-toggle span {
      margin-left: 0;
      font-size: 13px;
      color: #333;
      font-weight: 400;
    }
    @media (max-width: 768px) {
      #admin-sidebar {
        display: none !important;
      }
    }
    .next-btn {
      display: block;
      width: calc(100% - 32px);
      margin: 24px 16px 0 16px;
      padding: 12px 0;
      background: linear-gradient(90deg, #FF8C42, #4B9FE1, #8860D0);
      color: #fff;
      font-size: 17px;
      font-weight: 600;
      text-align: center;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      cursor: pointer;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .next-btn:hover {
      background: linear-gradient(90deg, #FF8C42, #4B9FE1, #8860D0);
      color: #fff;
      box-shadow: 0 6px 18px rgba(75,159,225,0.13);
    }
    .aa-title-link {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
  </style>
  
  <script>
    // Analytics tracking for cloned webpage
    function trackNextClicked() {
      try {
        // Try to use parent window's amplitude if available
        if (window.parent && window.parent.amplitude) {
          window.parent.amplitude.track('Next Clicked', {
            button_type: 'next',
            context: 'cloned_webpage_panel',
            timestamp: new Date().toISOString(),
            url: window.location.href
          });
        }
        // Also try to post message to parent window
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'ANALYTICS_EVENT',
            eventName: 'Next Clicked',
            properties: {
              button_type: 'next',
              context: 'cloned_webpage_panel',
              timestamp: new Date().toISOString(),
              url: window.location.href
            }
          }, '*');
        }
        console.log('📊 Analytics Event: Next Clicked');
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    }
  </script>

  <div id="admin-sidebar">
    <div class="admin-header">Configure Ask Anything Button:</div>
    <div class="divider"></div>
    <div class="collapsible-header" id="appearance-header">
      Appearance
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div>
    <div class="collapsible-content open" id="appearance-content">
      <div class="slider-section">
        <span class="slider-label">Widget Size</span>
        <div class="size-btn-group">
          <button class="size-btn" data-size="small">Small</button>
          <button class="size-btn selected" data-size="medium">Medium</button>
          <button class="size-btn" data-size="large">Large</button>
        </div>
      </div>
      <div style="height: 12px;"></div>
      <div class="style-section">
        <span class="section-label">Style</span>
        <div class="style-toggle-group">
          <button class="style-toggle selected" data-style="default">Default</button>
          <button class="style-toggle" data-style="match">Match My Site</button>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="collapsible-header" id="content-header">
      Content
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div>
    <div class="collapsible-content open" id="content-content">
      <div style="margin-bottom: 18px;">
        <div class="section-label" style="margin-bottom: 8px;">My Content:</div>
        <div class="my-content-upload-box" style="border: 1.5px dashed #bdbdbd; border-radius: 10px; padding: 18px 14px; background: #fafbfc; display: flex; flex-direction: column; align-items: center; gap: 10px; max-width: 100%; box-sizing: border-box;">
          <div style="font-size: 15px; color: #444; margin-bottom: 6px;">Upload files or paste URLs to your content</div>
          <input type="file" multiple style="margin-bottom: 8px; max-width: 100%; width: 100%; box-sizing: border-box;" />
          <input type="text" placeholder="Paste URLs (comma separated)" style="width: 100%; padding: 7px 10px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
        </div>
      </div>
      <div style="margin-bottom: 8px; margin-top: 18px;">
        <div class="section-label" style="margin-bottom: 8px;">Network Content:</div>
        <div class="collapsible-header" id="network-header" style="margin-bottom: 0; margin-top: 0; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding-left: 0; padding-right: 0;">
          Augment with Gist Answers
          <svg id="network-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="collapsible-content open" id="network-content" style="padding-top: 0;">
          <label class="source-toggle">
            <input type="checkbox" id="mycontent-archive">
            <div class="toggle-switch"></div>
            <span>Archive</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="mycontent-active">
            <div class="toggle-switch"></div>
            <span>Active</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="source-news">
            <div class="toggle-switch"></div>
            <span>News</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="source-business">
            <div class="toggle-switch"></div>
            <span>Business</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="source-lifestyle">
            <div class="toggle-switch"></div>
            <span>Lifestyle</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="source-sports">
            <div class="toggle-switch"></div>
            <span>Sports</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="source-books">
            <div class="toggle-switch"></div>
            <span>Books</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="source-academic">
            <div class="toggle-switch"></div>
            <span>Academic</span>
          </label>
          <label class="source-toggle">
            <input type="checkbox" id="source-reference">
            <div class="toggle-switch"></div>
            <span>Reference</span>
          </label>
        </div>
      </div>
    </div>
    <div class="divider" style="margin: 12px 0 8px 0;"></div>
    <div class="collapsible-header" id="goals-header">
      Goals
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div>
    <div class="collapsible-content open" id="goals-content">
      <div class="slider-section" style="margin-bottom: 12px; padding: 0 4px;">
        <span class="slider-label" style="font-size: 15px;">Set Goal</span>
        <div style="display: flex; align-items: center; gap: 6px;">
          <input type="range" min="0" max="100" value="50" class="goal-slider" style="flex: 1; height: 2px; margin-bottom: 0;" />
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 2px; width: 100%;">
          <span style="font-size: 12px; color: #666; text-align: left; flex: 1;">Engagement</span>
          <span style="font-size: 12px; color: #666; text-align: center; flex: 1;">Growth</span>
          <span style="font-size: 12px; color: #666; text-align: right; flex: 1;">Monetization</span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, auto); gap: 6px; margin-top: 10px; padding: 0 2px;">
        <label class="goal-toggle" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px;">
          <input type="checkbox" style="margin: 0;" />
          <span>Summarize</span>
        </label>
        <label class="goal-toggle" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px;">
          <input type="checkbox" style="margin: 0;" />
          <span>Listen</span>
        </label>
        <label class="goal-toggle" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px;">
          <input type="checkbox" style="margin: 0;" />
          <span>Remix</span>
        </label>
        <label class="goal-toggle" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px;">
          <input type="checkbox" style="margin: 0;" />
          <span>Avatar</span>
        </label>
        <label class="goal-toggle" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px;">
          <input type="checkbox" style="margin: 0;" />
          <span>Related</span>
        </label>
        <label class="goal-toggle" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px;">
          <input type="checkbox" style="margin: 0;" />
          <span>Share</span>
        </label>
      </div>
    </div>
    <a href="#" class="next-btn" onclick="event.preventDefault(); window.location.href = window.location.origin + '/setup';">Next -&gt;</a>
  </div>
  <button id="sidebar-toggle-btn-fixed" class="sidebar-toggle-btn-fixed" title="Show/Hide Admin Panel">
    <svg id="sidebar-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>
  <style>
    .sidebar-toggle-btn-fixed {
      position: fixed !important;
      left: calc(100vw - 320px - 36px);
      right: auto;
      top: 50vh;
      transform: translateY(-50%) translateX(0);
      z-index: 1000002 !important;
      width: 40px !important;
      height: 40px !important;
      background: #e5e7eb !important;
      color: #666 !important;
      border: 1px solid #d1d5db !important;
      border-radius: 50% !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: left 0.4s cubic-bezier(0.4,0,0.2,1), right 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1), background 0.2s, color 0.2s !important;
      border: 2px solid transparent !important;
      background-image: linear-gradient(#e5e7eb, #e5e7eb), linear-gradient(60deg, #FF8C42, #4B9FE1, #8860D0) !important;
      background-origin: border-box !important;
      background-clip: padding-box, border-box !important;
    }
    .sidebar-toggle-btn-fixed:hover {
      background: #d1d5db !important;
      color: #333 !important;
    }
    @media (max-width: 900px) {
      .sidebar-toggle-btn-fixed {
        left: 12px !important;
      }
    }
    #gpa-overlay {
      position: fixed;
      top: 64px;
      left: 0;
      width: 100vw;
      height: calc(100vh - 64px);
      background: #000;
      opacity: 0;
      pointer-events: none;
      z-index: 999997;
      transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    #gpa-overlay.active {
      opacity: 0.15;
      pointer-events: auto;
    }
    .gpa-widget-moveup {
      bottom: 120px !important;
      transition: bottom 0.3s cubic-bezier(0.4,0,0.2,1) !important;
    }
  </style>
  <div id="gpa-overlay"></div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const sidebar = document.getElementById('admin-sidebar');
      const toggleBtn = document.getElementById('sidebar-toggle-btn-fixed');
      const toggleIcon = document.getElementById('sidebar-toggle-icon');
      const overlay = document.getElementById('gpa-overlay');
      let isMinimized = false;

      function setPanelState(minimized) {
        isMinimized = minimized;
        sidebar.classList.toggle('minimized', minimized);
        // Chevron direction: right if minimized, left if expanded
        toggleIcon.innerHTML = minimized
          ? '<polyline points="9 18 15 12 9 6"></polyline>'
          : '<polyline points="15 18 9 12 15 6"></polyline>';
        // Lock body scroll when sidebar is open
        if (!minimized) {
          document.body.style.overflow = 'hidden';
          toggleBtn.style.left = 'calc(100vw - 320px - 36px)';
          toggleBtn.style.right = 'auto';
          toggleBtn.style.transform = 'translateY(-50%) translateX(0)';
          overlay.classList.add('active');
          // Move widget up
          const widget = document.querySelector('.gist-widget-container');
          if (widget) widget.classList.add('gpa-widget-moveup');
        } else {
          document.body.style.overflow = '';
          toggleBtn.style.left = 'auto';
          toggleBtn.style.right = '0';
          toggleBtn.style.transform = 'translateY(-50%) translateX(0)';
          overlay.classList.remove('active');
          // Move widget back down
          const widget = document.querySelector('.gist-widget-container');
          if (widget) widget.classList.remove('gpa-widget-moveup');
        }
        // Notify widget of panel state
        window.postMessage({ type: 'GPA_PANEL_STATE', open: !minimized }, '*');
      }

      toggleBtn.addEventListener('click', function() {
        setPanelState(!isMinimized);
        // Track side panel toggle
        try {
          if (window.parent !== window) {
            window.parent.postMessage({
              type: 'ANALYTICS_EVENT',
              eventName: 'Side Panel Toggled',
              properties: { open: !isMinimized }
            }, '*');
          }
        } catch (e) {}
      });

      // Widget size button group
      const sizeBtns = sidebar.querySelectorAll('.size-btn');
      sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          sizeBtns.forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
          // Send widget size to widget.js
          window.postMessage({ type: 'GIST_WIDGET_SIZE', size: this.dataset.size }, '*');
          // Track widget size change
          try {
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'ANALYTICS_EVENT',
                eventName: 'Widget Size Changed',
                properties: { size: this.dataset.size }
              }, '*');
            }
          } catch (e) {}
        });
      });

      // Style toggle group
      const styleToggles = sidebar.querySelectorAll('.style-toggle');
      styleToggles.forEach(btn => {
        btn.addEventListener('click', function() {
          styleToggles.forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
          // Track widget style change
          try {
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'ANALYTICS_EVENT',
                eventName: 'Widget Style Changed',
                properties: { style: this.dataset.style }
              }, '*');
            }
          } catch (e) {}
        });
      });

      // Collapsible Appearance section
      const appearanceHeader = document.getElementById('appearance-header');
      const appearanceContent = document.getElementById('appearance-content');
      let appearanceOpen = true;
      appearanceHeader.addEventListener('click', function() {
        appearanceOpen = !appearanceOpen;
        appearanceHeader.classList.toggle('open', appearanceOpen);
        appearanceContent.classList.toggle('open', appearanceOpen);
        // Track panel section toggle
        try {
          if (window.parent !== window) {
            window.parent.postMessage({
              type: 'ANALYTICS_EVENT',
              eventName: 'Panel Section Toggled',
              properties: { section: 'appearance', expanded: appearanceOpen }
            }, '*');
          }
        } catch (e) {}
      });

      // Collapsible Content section
      const contentHeader = document.getElementById('content-header');
      const contentContent = document.getElementById('content-content');
      let contentOpen = true;
      contentHeader.addEventListener('click', function() {
        contentOpen = !contentOpen;
        contentHeader.classList.toggle('open', contentOpen);
        contentContent.classList.toggle('open', contentOpen);
        // Track panel section toggle
        try {
          if (window.parent !== window) {
            window.parent.postMessage({
              type: 'ANALYTICS_EVENT',
              eventName: 'Panel Section Toggled',
              properties: { section: 'content', expanded: contentOpen }
            }, '*');
          }
        } catch (e) {}
      });

      // Collapsible Network Content section
      const networkHeader = document.getElementById('network-header');
      const networkContent = document.getElementById('network-content');
      const networkChevron = document.getElementById('network-chevron');
      let networkOpen = true;
      networkHeader.addEventListener('click', function() {
        networkOpen = !networkOpen;
        networkHeader.classList.toggle('open', networkOpen);
        networkContent.classList.toggle('open', networkOpen);
        networkChevron.style.transform = networkOpen ? 'rotate(90deg)' : 'rotate(0deg)';
      });

      // Collapsible Goals section
      const goalsHeader = document.getElementById('goals-header');
      const goalsContent = document.getElementById('goals-content');
      let goalsOpen = true;
      goalsHeader.addEventListener('click', function() {
        goalsOpen = !goalsOpen;
        goalsHeader.classList.toggle('open', goalsOpen);
        goalsContent.classList.toggle('open', goalsOpen);
        // Track panel section toggle
        try {
          if (window.parent !== window) {
            window.parent.postMessage({
              type: 'ANALYTICS_EVENT',
              eventName: 'Panel Section Toggled',
              properties: { section: 'goals', expanded: goalsOpen }
            }, '*');
          }
        } catch (e) {}
      });

      // Initialize state
      setPanelState(false);

      // Track content source toggles
      const sourceToggles = sidebar.querySelectorAll('.source-toggle input[type="checkbox"]');
      sourceToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
          const sourceName = this.parentElement.querySelector('span').textContent;
          try {
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'ANALYTICS_EVENT',
                eventName: 'Content Source Toggled',
                properties: { source: sourceName, enabled: this.checked }
              }, '*');
            }
          } catch (e) {}
        });
      });

      // Track goal slider
      const goalSlider = sidebar.querySelector('.goal-slider');
      if (goalSlider) {
        let sliderTimeout;
        goalSlider.addEventListener('input', function() {
          clearTimeout(sliderTimeout);
          sliderTimeout = setTimeout(() => {
            const value = parseInt(this.value);
            let goal = 'engagement';
            if (value > 66) goal = 'monetization';
            else if (value > 33) goal = 'growth';
            
            try {
              if (window.parent !== window) {
                window.parent.postMessage({
                  type: 'ANALYTICS_EVENT',
                  eventName: 'Goal Slider Changed',
                  properties: { value: value, goal: goal }
                }, '*');
              }
            } catch (e) {}
          }, 500);
        });
      }

      // Track goal feature toggles
      const goalToggles = sidebar.querySelectorAll('.goal-toggle input[type="checkbox"]');
      goalToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
          const featureName = this.parentElement.querySelector('span').textContent;
          try {
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'ANALYTICS_EVENT',
                eventName: 'Goal Feature Toggled',
                properties: { feature: featureName, enabled: this.checked }
              }, '*');
            }
          } catch (e) {}
        });
      });

      // Track Next button click
      const nextBtn = sidebar.querySelector('.next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          try {
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'ANALYTICS_EVENT',
                eventName: 'Next Clicked',
                properties: {}
              }, '*');
            }
          } catch (e) {}
          // Navigate after tracking
          setTimeout(() => {
            window.location.href = window.location.origin + '/setup';
          }, 100);
        });
      }
    });
  </script>
`;

// Add Ask Anything banner (above everything)
const askAnythingBanner = `
  <style>
    #aa-banner {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      z-index: 1000000;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px 0 24px;
      height: 64px;
      font-family: 'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      border: 2px solid transparent;
      background-image: linear-gradient(#fff, #fff), linear-gradient(60deg, #FF8C42, #4B9FE1, #8860D0);
      background-origin: border-box;
      background-clip: padding-box, border-box;
    }
    #aa-banner .aa-title-container {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    #aa-banner .aa-preview {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      color: #111;
      letter-spacing: 0.02em;
      width: max-content;
      margin: 0;
      z-index: 2;
    }
    #aa-banner .aa-title {
      font-size: 22px;
      font-weight: 700;
      color: #18181b;
      display: block;
      text-align: left;
      line-height: 1.02;
      margin-bottom: 0;
      z-index: 1;
    }
    #aa-banner .aa-title sup {
      font-size: 0.5em;
      vertical-align: super;
      margin-left: 2px;
      letter-spacing: 0;
      position: relative;
      top: -0.2em;
      right: 0.2em;
    }
    @media (max-width: 600px) {
      #aa-banner {
        flex-direction: column;
        height: auto;
        padding: 8px 8px 8px 8px;
        gap: 8px;
      }
      #aa-banner .aa-title {
        font-size: 1.2rem;
      }
      #aa-banner .aa-preview {
        font-size: 0.9rem;
        margin-right: 0;
      }
    }
    body {
      margin-top: 64px !important;
    }
    #admin-sidebar {
      top: 64px !important;
      height: calc(100vh - 64px) !important;
    }
  </style>
  <div id="aa-banner">
    <div class="aa-title-container">
      <a href="https://getaskanything.com" target="_blank" class="aa-title-link">
        <div class="aa-title">
          <span class="aa-ask">Ask</span><br>
          <span class="aa-anything">Anything<sup style="font-size:0.75em;">™</sup></span>
        </div>
      </a>
      <div class="aa-preview">Try Your Demo Ask Anything Button Below:</div>
    </div>
  </div>
`;

export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow GET and POST requests
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get URL from query parameters
    const targetUrl = req.query.url;
    const isTest = req.query.test === 'true';

    // Validate URL parameter
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Use our URL validator to normalize and validate the URL
    const validation = validateUrl(targetUrl);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const normalizedUrl = validation.normalizedUrl;

    // Security checks - block internal/private IPs
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    if (blockedHosts.includes(new URL(normalizedUrl).hostname)) {
      return res.status(403).json({ error: 'Access to local addresses is not allowed' });
    }

    // Check for private IP ranges (RFC 1918)
    const privateIPRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
    if (privateIPRegex.test(new URL(normalizedUrl).hostname)) {
      return res.status(403).json({ error: 'Access to private IP addresses is not allowed' });
    }

    // Simple rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const clientRequests = requestCounts.get(clientIP) || { count: 0, resetTime: now + RATE_WINDOW };

    if (now > clientRequests.resetTime) {
      clientRequests.count = 0;
      clientRequests.resetTime = now + RATE_WINDOW;
    }

    clientRequests.count++;
    requestCounts.set(clientIP, clientRequests);

    if (clientRequests.count > RATE_LIMIT) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((clientRequests.resetTime - now) / 1000)
      });
    }

    // If this is just a test request, return success
    if (isTest) {
      try {
        // Do a HEAD request to check if URL is reachable
        await axios.head(normalizedUrl, { 
          timeout: 8000,
          validateStatus: status => status < 500,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Test request failed for:', normalizedUrl, error.message);
        
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          return res.status(408).json({ 
            error: 'Website is taking too long to respond. It may be slow or have restrictions.',
            details: 'Connection timeout'
          });
        }
        
        if (error.code === 'ECONNREFUSED') {
          return res.status(503).json({ 
            error: 'Website refused the connection.',
            details: 'Connection refused'
          });
        }
        
        return res.status(400).json({ 
          error: 'Unable to reach the specified website',
          details: error.message,
          code: error.code
        });
      }
    }

    // Fetch the target website
    const response = await axios.get(normalizedUrl, {
      timeout: 30000,
      maxRedirects: 5,
      validateStatus: status => status < 500,
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    // Get content type
    const contentType = response.headers['content-type'] || 'text/html';

    // Basic HTML modification to fix relative URLs and inject widget
    let html = response.data;
    if (contentType.includes('text/html')) {
      // Basic URL rewriting - convert relative URLs to absolute
      const baseUrl = new URL(normalizedUrl).origin;
      
      // Fix relative links (use global replace)
      html = html.replace(/href="\/([^"]*)"/g, `href="${baseUrl}/$1"`);
      html = html.replace(/src="\/([^"]*)"/g, `src="${baseUrl}/$1"`);
      
      // Add base tag for better relative URL handling
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head><base href="${normalizedUrl}">`);
      }

      // Inject widget.js script into the HTML
      const protocol = req.headers['x-forwarded-proto'] || (req.headers['x-forwarded-for'] ? 'https' : 'http');
      const host = req.headers.host || 'localhost:3000';
      const widgetScript = `<script src="${protocol}://${host}/widget.js"></script>`;
      
      // More robust injection logic
      if (html.includes('</head>')) {
        // Inject before closing head tag
        html = html.replace('</head>', `${widgetScript}</head>`);
        console.log('Widget injected before </head>');
      } else if (html.includes('</body>')) {
        // Fallback: inject before closing body tag
        html = html.replace('</body>', `${widgetScript}</body>`);
        console.log('Widget injected before </body>');
      } else if (html.includes('<body')) {
        // Another fallback: inject after opening body tag
        html = html.replace(/(<body[^>]*>)/, `$1${widgetScript}`);
        console.log('Widget injected after <body>');
      } else {
        // Last resort: append to the end
        html += widgetScript;
        console.log('Widget appended to end of HTML');
      }
      
      // Inject Ask Anything banner at the very top
      if (html.includes('<body')) {
        html = html.replace(/(<body[^>]*>)/, `$1${askAnythingBanner}`);
        console.log('Ask Anything banner injected after <body>');
      } else {
        html = askAnythingBanner + html;
        console.log('Ask Anything banner added at beginning of HTML');
      }
      
      // Inject admin sidebar right after opening body tag
      if (html.includes('<body')) {
        html = html.replace(/(<body[^>]*>)/, `$1${adminSidebar}`);
        console.log('Admin sidebar injected after <body>');
      } else {
        // Fallback: add at the beginning of the HTML
        html = adminSidebar + html;
        console.log('Admin sidebar added at beginning of HTML');
      }
      
      // Verify injection
      if (html.includes('widget.js')) {
        console.log('✓ Widget script successfully injected into HTML');
      } else {
        console.log('✗ Widget script NOT found in final HTML');
      }
      
      if (html.includes('admin-sidebar')) {
        console.log('✓ Admin sidebar successfully injected into HTML');
      } else {
        console.log('✗ Admin sidebar NOT found in final HTML');
      }
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Proxied-URL', normalizedUrl);
    
    // Remove headers that might prevent embedding
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    
    // Send the content
    return res.status(200).send(html);

  } catch (error) {
    console.error('Proxy error:', error.message);

    // Determine appropriate error response
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(408).json({ 
        error: 'Request timed out. The website may be slow or unavailable.' 
      });
    }

    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'Website not found' });
      }
      if (error.response.status === 403) {
        return res.status(403).json({ error: 'Access forbidden by the target website' });
      }
      if (error.response.status >= 500) {
        return res.status(502).json({ error: 'Target website server error' });
      }
    }

    if (error.request) {
      return res.status(502).json({ 
        error: 'Unable to reach the website. Please check the URL.' 
      });
    }

    // Something else happened
    return res.status(500).json({ 
      error: 'An unexpected error occurred while processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Export config for Next.js API routes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    },
    responseLimit: false
  }
};