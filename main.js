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
    revealOnScroll();
    // Initial check

    // Custom ML AI Logic
    const chatInterface = document.getElementById('chatInterface');
    const startBtn = document.querySelector('.btn-primary');
    const heroStartBtn = document.querySelector('.btn-glitch');
    const closeChatBtn = document.getElementById('closeChat');
    const sendMessageBtn = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatHistory = document.getElementById('chatHistory');
    const API_URL = "http://localhost:8000/chat";

    const toggleChat = () => {
        chatInterface.classList.toggle('active');
        if (chatInterface.classList.contains('active')) {
            userInput.focus();
        }
    };

    startBtn.addEventListener('click', toggleChat);
    heroStartBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);

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

        addMessage(text, 'user');
        userInput.value = '';

        // Add Typing Indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'ai-message', 'typing');
        typingDiv.innerHTML = `<span>God Level AI is thinking</span><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        chatHistory.appendChild(typingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            chatHistory.removeChild(typingDiv);

            if (data.response) {
                addMessage(data.response, 'ai');
            } else {
                throw new Error("Invalid Server Response");
            }
        } catch (error) {
            chatHistory.removeChild(typingDiv);
            addMessage("I am currently offline. Please ensure the SMARTEDU ML Backend is running locally.", 'ai');
            console.error("Backend Error:", error);
        }
    };

    sendMessageBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
});
