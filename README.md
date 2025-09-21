# Language Translator

A **Google Translator-like** web app built with **React**, **Tailwind CSS**, and **React Icons**. This app provides horizontal layout translation, text-to-speech, speech-to-text, dark mode, and simple beginner-friendly UI.

## Features

* Two side-by-side boxes for **source and target languages**
* **Dark/Light mode** toggle
* **Dropdown menus** to select languages
* **Translate button** using [MyMemory API](https://mymemory.translated.net/doc/spec.php)
* **Text-to-Speech** for both source and translated text
* **Speech-to-Text** (microphone input) for source text
* **Clear** and **Swap** buttons
* Beginner-friendly and responsive UI

## Demo

![Demo Screenshot](screenshot.png)

## Installation

1. Clone the repository

```bash
git clone https://github.com/SumanDas60/language-translator.git
```

2. Install dependencies

```bash
cd language-translator
npm install
```

3. Start the development server

```bash
npm start
```

The app should now be running at `http://localhost:3000`

## Usage

1. Select the **source** and **target languages** from the dropdowns.
2. Type text in the left box or use the microphone for speech input.
3. Click **Translate** to get the translation.
4. Click the **Speak** button to hear text in the selected language.
5. Use **Swap** to switch languages or **Clear** to reset both boxes.
6. Toggle **Dark/Light Mode** using the top-right button.

## Technologies Used

* **React**
* **Tailwind CSS**
* **React Icons**
* **MyMemory Translation API**
* Browser **SpeechRecognition API** and **SpeechSynthesis API**

## Notes

* Speech-to-Text works best in **Chrome desktop**.
* The translation is powered by the **free MyMemory API**, which may have limits.

## License

This project is licensed under the MIT License.