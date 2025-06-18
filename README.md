# **SearchExporter**  
*Manual export of your Discord search results, page by page.*

---

### **What is this?**  
BetterDiscord plugin that a adds simple buttons to your Discord search results so you can export messages without all the hassle.

---

### **Features**  
- **Export messages page by page** (no annoying rate limits)  
- Works in **DMs, servers, group chats**, whatever

---

### **How to use**  
1. Install the plugin (**make sure you have ZeresPluginLibrary too**)  
2. Go to **Discord’s search tab**  
3. Use the buttons at the top of the results:  
   - **Export This Page:** saves all messages currently loaded  
   - **Scroll to Bottom:** loads more messages by scrolling down  
   - **End Export:** saves everything you collected into a **.txt** file

---

### **Download**  
Just grab the plugin file from the **plugin** folder in this repo.

---

### **Known issues**  
- Buttons might take a sec to show up after you search  
- You gotta **manually scroll** to load messages (Discord lazy loads them)  
- Exports only what’s **currently loaded** in the search results

---

### **Sources/Help I got from StackOverflow** 
1. Detecting if a DOM element exists & polling for it (for your button injection every 2 seconds)
https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists

2. Creating and styling DOM elements (buttons & wrappers) with JavaScript
https://stackoverflow.com/questions/34686567/how-to-inject-html-into-a-webpage-using-javascript

https://stackoverflow.com/questions/27290368/how-to-set-css-style-property-in-javascript

3. Handling click events on dynamically created buttons
https://stackoverflow.com/questions/6348498/addeventlistener-on-a-dynamically-created-element

4. Scrolling a container programmatically to bottom
https://stackoverflow.com/questions/23892547/how-to-scroll-to-the-bottom-of-a-div-with-javascript

5. Querying DOM elements with complex selectors
https://stackoverflow.com/questions/11303846/how-to-select-elements-by-class-containing-a-certain-string

6. Collecting unique messages using Set in JavaScript (avoid duplicates)
https://stackoverflow.com/questions/1985619/how-to-avoid-duplicates-in-javascript-array

7. Creating and downloading a .txt file from JavaScript (Blob, URL.createObjectURL)
https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-with-javascript

8. Parsing timestamps and formatting dates
https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
