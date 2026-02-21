(function () {

  // ==============================
  // CONFIGURATION
  // ==============================

  const botId = document.currentScript.getAttribute("data-bot");
  const webhookUrl = "https://n8n.snapcartgo.com/webhook/CreateAppointmentbooking";

  // ==============================
  // SESSION HANDLING
  // ==============================

  let sessionId = localStorage.getItem("chat_session");

  if (!sessionId) {
    sessionId = "session_" + Date.now();
    localStorage.setItem("chat_session", sessionId);
  }

  // ==============================
  // CREATE CHAT BUBBLE
  // ==============================

  const bubble = document.createElement("div");
  bubble.innerHTML = "💬";
  bubble.style.position = "fixed";
  bubble.style.bottom = "20px";
  bubble.style.right = "20px";
  bubble.style.width = "60px";
  bubble.style.height = "60px";
  bubble.style.borderRadius = "50%";
  bubble.style.background = "#111";
  bubble.style.color = "#fff";
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.cursor = "pointer";
  bubble.style.zIndex = "9999";
  document.body.appendChild(bubble);

  // ==============================
  // CREATE CHAT BOX
  // ==============================

  const chatBox = document.createElement("div");
  chatBox.style.position = "fixed";
  chatBox.style.bottom = "90px";
  chatBox.style.right = "20px";
  chatBox.style.width = "320px";
  chatBox.style.height = "420px";
  chatBox.style.background = "#fff";
  chatBox.style.border = "1px solid #ccc";
  chatBox.style.borderRadius = "10px";
  chatBox.style.display = "none";
  chatBox.style.flexDirection = "column";
  chatBox.style.zIndex = "9999";
  chatBox.style.boxShadow = "0 5px 20px rgba(0,0,0,0.2)";
  chatBox.style.fontFamily = "Arial, sans-serif";
  document.body.appendChild(chatBox);

  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";
  chatBox.appendChild(messages);

  const input = document.createElement("input");
  input.placeholder = "Type your message...";
  input.style.border = "none";
  input.style.borderTop = "1px solid #ccc";
  input.style.padding = "10px";
  input.style.outline = "none";
  chatBox.appendChild(input);

  bubble.onclick = () => {
    chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
  };

  // ==============================
  // SEND MESSAGE FUNCTION
  // ==============================

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {

      const userMessage = input.value;
      input.value = "";

      addMessage("You", userMessage);

      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          bot_id: botId,
          session_id: sessionId
        })
      })
      .then(res => res.json())
      .then(data => {
        addMessage("Bot", data.reply);
      })
      .catch(err => {
        addMessage("Bot", "Error connecting to server.");
      });

    }
  });

  // ==============================
  // ADD MESSAGE FUNCTION
  // ==============================

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.style.marginBottom = "8px";
    msg.innerHTML = "<strong>" + sender + ":</strong> " + text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

})();
