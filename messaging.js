/* ==========================================================================
   CampusLink - Peer Messaging View
   ========================================================================== */

import { appState } from "../state/app-state.js";
import { dbService } from "../services/db-service.js";
import { authService } from "../services/auth-service.js";
import { renderNavbar, attachNavbarEvents } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderBottomNav } from "../components/bottom-nav.js";
import { escapeHtml } from "../utils/helpers.js";

export function renderMessagingPage(activeConvId = null) {
  const conversations = dbService.getConversations();
  const selectedConv = (activeConvId ? dbService.getConversationById(activeConvId) : null) || conversations[0] || null;
  const currentUser = appState.get("currentUser");

  return `
    ${renderNavbar()}

    <div class="app-container two-column">
      ${renderSidebar("/messaging")}

      <main class="main-content">
        <div class="messaging-container">
          <!-- Left: Conversations List -->
          <div class="conversations-panel ${selectedConv && window.innerWidth < 768 ? 'hidden-mobile' : ''}">
            <div class="conversations-header">
              <h3>Messages</h3>
              <div class="input-with-icon">
                <svg class="input-icon-left" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="form-input" id="search-peers-input" placeholder="Search student by name..." style="padding-top: 6px; padding-bottom: 6px; font-size: 12px;" />
              </div>
            </div>

            <div class="conversations-list" id="conversations-list-container">
              ${conversations.map(conv => `
                <div class="conversation-item ${selectedConv?.id === conv.id ? 'active' : ''}" data-conv-id="${conv.id}">
                  <div class="avatar avatar-sm">
                    <img src="${conv.partnerAvatar}" alt="${escapeHtml(conv.partnerName)}" />
                  </div>
                  <div class="conversation-info">
                    <div class="conversation-top">
                      <span class="conversation-name">${escapeHtml(conv.partnerName)}</span>
                      <span class="conversation-time">${escapeHtml(conv.lastTime || '')}</span>
                    </div>
                    <div class="conversation-last-msg">${escapeHtml(conv.lastMessage || '')}</div>
                  </div>
                  ${conv.unread ? '<div class="conversation-unread-dot"></div>' : ''}
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Right: Active Chat Area -->
          <div class="chat-panel" id="active-chat-panel">
            ${selectedConv ? `
              <div class="chat-header">
                <div class="chat-partner-meta">
                  <div class="avatar avatar-sm">
                    <img src="${selectedConv.partnerAvatar}" alt="${escapeHtml(selectedConv.partnerName)}" />
                  </div>
                  <div>
                    <div class="chat-partner-name">${escapeHtml(selectedConv.partnerName)}</div>
                    <div class="chat-partner-status">
                      <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--success);"></span>
                      <span>Online • ${escapeHtml(selectedConv.partnerUniversity || "Student")}</span>
                    </div>
                  </div>
                </div>

                <a href="#/profile/${selectedConv.partnerId}" class="btn btn-ghost btn-sm" title="View Profile">
                  View Profile
                </a>
              </div>

              <!-- Message Stream -->
              <div class="chat-messages" id="chat-messages-container">
                ${(selectedConv.messages || []).map(m => {
                  const isOut = m.senderId === currentUser?.id;
                  return `
                    <div class="message-bubble ${isOut ? 'message-out' : 'message-in'}">
                      <div>${escapeHtml(m.text)}</div>
                      <div class="message-timestamp">${escapeHtml(m.time || '')}</div>
                    </div>
                  `;
                }).join("")}
              </div>

              <!-- Chat Input Bar -->
              <form class="chat-input-bar" id="chat-send-form" data-conv-id="${selectedConv.id}">
                <input 
                  type="text" 
                  class="chat-input" 
                  id="chat-text-input" 
                  placeholder="Type a message to ${escapeHtml(selectedConv.partnerName.split(' ')[0])}..." 
                  autocomplete="off" 
                  required 
                />
                <button type="submit" class="btn btn-primary btn-sm" style="border-radius: var(--radius-full); padding: 0.6rem 1rem;">
                  Send
                </button>
              </form>
            ` : `
              <div class="empty-state" style="margin: auto;">
                <div class="empty-state-icon">💬</div>
                <div class="empty-state-title">Select a conversation</div>
                <div class="empty-state-desc">Choose a classmate or search for a student to start chatting.</div>
              </div>
            `}
          </div>
        </div>
      </main>
    </div>

    ${renderBottomNav("/messaging")}
  `;
}

export function attachMessagingEvents(activeConvId = null) {
  attachNavbarEvents();

  // Switch conversation on click
  document.querySelectorAll(".conversation-item").forEach(item => {
    item.addEventListener("click", () => {
      const convId = item.getAttribute("data-conv-id");
      window.location.hash = `#/messaging/${convId}`;
    });
  });

  // Search students to message
  const searchPeersInput = document.getElementById("search-peers-input");
  if (searchPeersInput) {
    searchPeersInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll(".conversation-item");
      items.forEach(el => {
        const name = el.querySelector(".conversation-name")?.textContent.toLowerCase() || "";
        el.style.display = name.includes(q) ? "flex" : "none";
      });
    });
  }

  // Send message form
  const sendForm = document.getElementById("chat-send-form");
  const msgInput = document.getElementById("chat-text-input");
  const msgContainer = document.getElementById("chat-messages-container");

  // Auto-scroll to bottom of messages
  if (msgContainer) {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  if (sendForm && msgInput && msgContainer) {
    sendForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = msgInput.value.trim();
      if (!text) return;

      const convId = sendForm.getAttribute("data-conv-id");
      const newMsg = dbService.sendMessage(convId, text);
      if (newMsg) {
        msgInput.value = "";
        const bubble = document.createElement("div");
        bubble.className = "message-bubble message-out";
        bubble.innerHTML = `
          <div>${escapeHtml(newMsg.text)}</div>
          <div class="message-timestamp">${escapeHtml(newMsg.time)}</div>
        `;
        msgContainer.appendChild(bubble);
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }
    });
  }
}
