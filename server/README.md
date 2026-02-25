# SMARTEDUAI ML Backend Setup

This directory contains the custom, independent Machine Learning backend for the SMARTEDUAI platform.

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- Basic knowledge of terminal/command prompt.

### 2. Install Dependencies
Navigate to the server directory and install the required libraries:
```bash
cd server
pip install -r requirements.txt
```

### 3. Configure API Token
1. Create a file named `.env` in the `server` directory.
2. Add your Hugging Face Token:
   ```env
   HF_TOKEN=your_token_here
   ```
   Get your token from [Hugging Face Settings](https://huggingface.co/settings/tokens).

### 4. Run the Server
Start the AI engine:
```bash
python main.py
```
The server will start at `http://localhost:8000`.

## 🧠 Why Hugging Face Inference?
- **Cloud Power**: Uses high-performance servers to run heavy models like Moonshot Kimi.
- **Independence**: Separate from mainstream providers like Google/OpenAI.
- **Customizable**: Easy to switch between thousands of open-source models.
