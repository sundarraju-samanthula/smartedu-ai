/* SMARTEDUAI Interactions */

document.addEventListener('DOMContentLoaded', () => {
    // Cursor Glow Tracking
    const cursorGlow = document.getElementById('cursorGlow');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        cursorGlow.style.left = `${x}px`;
        cursorGlow.style.top = `${y}px`;
    });

    // Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // API Configuration Logic
    let GEMINI_API_KEY = localStorage.getItem('GEMINI_API_KEY') || '';
    const apiSettings = document.getElementById('apiSettings');
    const openSettingsBtn = document.getElementById('openSettings');
    const cancelSettingsBtn = document.getElementById('cancelSettings');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const apiKeyInput = document.getElementById('apiKeyInput');

    const toggleSettings = () => apiSettings.classList.toggle('hidden');

    openSettingsBtn.addEventListener('click', toggleSettings);
    cancelSettingsBtn.addEventListener('click', toggleSettings);

    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            GEMINI_API_KEY = key;
            localStorage.setItem('GEMINI_API_KEY', key);
            toggleSettings();
            addMessage("API Key saved! I'm now connected and ready to provide 'God Level' assistance.", 'ai');
        }
    });

    if (GEMINI_API_KEY) {
        apiKeyInput.value = GEMINI_API_KEY;
    }

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');

        // Handle markdown-like formatting for AI responses
        if (sender === 'ai') {
            const formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>')
                .replace(/`([^`]+)`/g, '<code style="background: rgba(0,242,255,0.1); padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>');
            messageDiv.innerHTML = `<p>${formattedText}</p>`;
        } else {
            messageDiv.innerHTML = `<p>${text}</p>`;
        }

        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return messageDiv;
    };

    const handleSendMessage = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        if (!GEMINI_API_KEY) {
            addMessage("Please configure your Gemini API Key in the settings (gear icon) to enable live responses.", 'ai');
            toggleSettings();
            return;
        }

        addMessage(text, 'user');
        userInput.value = '';

        // Add Typing Indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'ai-message', 'typing');
        typingDiv.innerHTML = `<span>Thinking</span><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        chatHistory.appendChild(typingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();
            chatHistory.removeChild(typingDiv);

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                addMessage(aiResponse, 'ai');
            } else {
                throw new Error("Invalid API Response");
            }
        } catch (error) {
            chatHistory.removeChild(typingDiv);
            addMessage("Error connecting to Gemini API. Please check your key and network connection.", 'ai');
            console.error(error);
        }
    };

    sendMessageBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
});
