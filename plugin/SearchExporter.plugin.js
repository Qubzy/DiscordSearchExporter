/**
 * @name SearchExporter
 * @author Qubzy
 * @version 1.0.6
 * @description Manual export of Discord search results, page by page. Export + Scroll buttons at top.
 */

module.exports = (() => {
    const config = {
        info: {
            name: "SearchExporter",
            authors: [{ name: "Qubzy", discord_id: "69" }],
            version: "1.0.6",
            description: "Manual export of Discord search results, page by page. Export + Scroll buttons at top.",
            github: "https://github.com/Qubzy/SearchExporter",
        },
    };

    // checks ZeresPluginLibrary, show a modal to download it
    return !global.ZeresPluginLibrary
        ? class {
              load() {
                  BdApi.showConfirmationModal("Missing Library", "ZeresPluginLibrary is missing. Click Download to install it.", {
                      confirmText: "Download",
                      cancelText: "Cancel",
                      onConfirm: () => BdApi.openLink("https://betterdiscord.app/Download"),
                  });
              }
              start() {}
              stop() {}
          }
        : (([Plugin, Api]) => {
              const { Logger } = Api;

              return class SearchExporter extends Plugin {
                  constructor() {
                      super();
                      this.collected = new Set(); // Stores all collected messages across pages
                  }

                  start() {
                      this.injectButtons(); // Add UI buttons to the search panel
                  }

                  stop() {
                      // Clean up buttons
                      ["search-export-btn", "search-end-export-btn", "search-scroll-btn"].forEach((id) => {
                          const el = document.getElementById(id);
                          if (el) el.remove();
                      });
                      clearInterval(this._interval);
                  }

                  injectButtons() {
                      // inject buttons every 2 seconds
                      this._interval = setInterval(() => {
                          const container = document.querySelector("[class*='searchResultsWrap']");
                          if (!container || document.getElementById("search-export-btn")) return;

                          // Create wrapper
                          const buttonWrapper = document.createElement("div");
                          buttonWrapper.style.display = "flex";
                          buttonWrapper.style.gap = "6px";
                          buttonWrapper.style.margin = "10px";
                          buttonWrapper.style.justifyContent = "flex-start";
                          buttonWrapper.id = "search-export-wrapper";

                          // Export Button
                          const exportBtn = document.createElement("button");
                          exportBtn.id = "search-export-btn";
                          exportBtn.innerText = "📁 Export This Page";
                          this.styleBtn(exportBtn, "#5865F2");

                          exportBtn.onclick = async () => {
                              try {
                                  exportBtn.disabled = true;
                                  exportBtn.innerText = "⏳ Exporting...";

                                  // grabs messages from the current page
                                  const messages = await this.collectMessages(container);
                                  messages.forEach((msg) => this.collected.add(msg));

                                  exportBtn.innerText = "✅ Page Exported";

                                  // Reset buttons after a second and scroll down
                                  setTimeout(() => {
                                      exportBtn.innerText = "📁 Export This Page";
                                      exportBtn.disabled = false;
                                      this.scrollToBottom(container);
                                  }, 1500);
                              } catch (e) {
                                  Logger.error("Export error:", e);
                                  alert("Export failed: " + (e.message || e));
                                  exportBtn.disabled = false;
                                  exportBtn.innerText = "📁 Export This Page";
                              }
                          };

                          //End Export Button (downloads)
                          const endBtn = document.createElement("button");
                          endBtn.id = "search-end-export-btn";
                          endBtn.innerText = "🛑 End Export";
                          this.styleBtn(endBtn, "#ED4245");

                          endBtn.onclick = () => {
                              if (this.collected.size === 0) {
                                  alert("Nothing to export!");
                                  return;
                              }

                              const data = [...this.collected];
                              this.saveAsTxt(data);
                              this.collected.clear();

                              BdApi.showToast(`Exported ${data.length} entries. Memory cleared.`, { type: "success" });
                          };

                          // Scroll to Bottom
                          const scrollBtn = document.createElement("button");
                          scrollBtn.id = "search-scroll-btn";
                          scrollBtn.innerText = "⬇ Scroll to Bottom";
                          this.styleBtn(scrollBtn, "#44AF69");

                          scrollBtn.onclick = () => {
                              this.scrollToBottom(container);
                          };

                          // Add all buttons to the container
                          buttonWrapper.append(exportBtn, endBtn, scrollBtn);
                          container.prepend(buttonWrapper);

                          Logger.log("Buttons added.");
                      }, 2000);
                  }

                  // Scrolls the search to the bottom
                  scrollToBottom(container) {
                      const scroller = container.querySelector("[class*='scroller']");
                      if (scroller) scroller.scrollTop = scroller.scrollHeight;
                  }

                  // styling to buttons
                  styleBtn(btn, bgColor) {
                      btn.style.cssText = `
              padding: 6px 12px;
              background: ${bgColor};
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            `;
                  }

                  // Pull message from visible search results
                  async collectMessages(container) {
                      const scrollContainer = container.querySelector("[class*='scroller']");
                      if (!scrollContainer) return [];

                      const messages = new Set();
                      const nodes = scrollContainer.querySelectorAll("[class*='message-'], [role='listitem']") || [];

                      nodes.forEach((node) => {
                          try {
                              // Try to grab the author
                              const authorNode = node.querySelector("[class*='username'], [class*='headerText-']");
                              const author = authorNode ? authorNode.innerText.trim() : "Unknown";

                              // Try to grab the timestamp
                              let timestamp = "Unknown time";
                              const timeNode = node.querySelector("time, [class*='timestamp']");
                              if (timeNode) {
                                  timestamp = timeNode.dateTime ? new Date(timeNode.dateTime).toLocaleString() : timeNode.innerText.trim();
                              }

                              // Try to grab the main message content
                              const contentNode = node.querySelector("[class*='messageContent'], [class*='markup-'], [class*='textArea-']");
                              const messageText = contentNode ? contentNode.innerText.trim() : "";

                              if (messageText) messages.add(`[${timestamp}] ${author}: ${messageText}`);

                              // Also grab embedded stuff like links or media
                              const embedNodes = node.querySelectorAll("[class*='embed'], [class*='panelEmbed']");
                              embedNodes.forEach((embed) => {
                                  const embedText = embed.innerText.trim();
                                  if (embedText) messages.add(`[${timestamp}] [Embed] ${embedText}`);
                              });
                          } catch (err) {
                              Logger.error("Message parse error:", err);
                          }
                      });

                      Logger.log(`Collected ${messages.size} from page.`);
                      return [...messages];
                  }

                  // Save all collected messages as a .txt file
                  saveAsTxt(messages) {
                      const text = messages.join("\n\n");
                      const blob = new Blob([text], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `discord-search-export-${Date.now()}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                  }
              };
          })(global.ZeresPluginLibrary.buildPlugin(config));
})();
