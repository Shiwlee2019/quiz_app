# quiz_app
#  ThinkStorm Quiz App

A fully interactive, responsive, and audio-enhanced quiz application developed by **Hanan**, **Shiwlee**, and **Ayesha**. This browser-based project allows users to sign in, answer trivia questions from a local JSON file or API, and receive real-time feedback through animations, sound effects, and score tracking.

---

##  Features

-  Light/Dark mode toggle
-  Real-time answer validation with emoji animations
-  Audio feedback for correct/incorrect answers
-  Per-question timer
-  Progress tracking and score display
-  Local or API-driven question loading
-  Clean UI using Bootstrap and custom CSS
-  Quiz history saved in local storage

---

##  Technologies Used

- **HTML5**, **CSS3**, **JavaScript (ES6)**
- **Bootstrap 5**
- **Font Awesome**
- **LocalStorage API**
- **Fetch API** for optional external questions
- **Audio API** for sound feedback

---

## Team Contribution

This project was built collaboratively, with all members contributing across all areas to ensure full participation and learning:

| Name      | Contributions |
|-----------|----------------|
| **Hanan** | Helped build the HTML structure and styled pages using Bootstrap. Collaborated on the quiz logic and local storage implementation. |
| **Shiwlee** | Developed the JavaScript game flow logic including timer, scoring, and dark mode. Integrated emoji feedback and ensured responsive UI. |
| **Ayesha** | Handled the design of the user interface, sound effects, and helped debug issues across the quiz.js and data fetch logic. |

All team members tested features, refined visuals, and shared the responsibility for writing and cleaning up final files (HTML, CSS, JS).

---

##  How to Run

1. Clone this repository or download the ZIP.
2. Ensure the following file structure:
    ```
    /index.html
    /Quiz/quiz.html
    /Quiz/quiz.js
    /Quiz/quiz.css
    /questions.json
    /Media/ (for image and sound files)
    ```
3. Open `index.html` in any modern browser.

---

##  File Structure

- `/index.html`: Landing page with sign-in or navigation
- `/Quiz/quiz.html`: Main quiz interface
- `/Quiz/quiz.js`: Quiz logic (fetching, scoring, emoji, timer)
- `/Quiz/quiz.css`: Styles for quiz interface
- `/questions.json`: Contains question data (local fallback)
- `/Media/`: Contains images and audio (`correct.mp3`, `wrong.mp3`, etc.)

---

## 

- Dark mode is saved between sessions using `localStorage`.
- If the API fails, it gracefully falls back to local question loading.
- Result scores are stored for future retrieval in `/Results/results.html`.



## Timeline

- Week 1: Planning and wireframe sketch
- Week 2: HTML/CSS Layout and base JavaScript
- Week 3: Full logic integration, testing, emoji/sound effects
- Week 4: Debugging, polish, and final deployment

---

##  Final Thoughts

This project helped us sharpen our understanding of:

- DOM manipulation
- Event handling
- Fetch and async behavior
- Modular UI/UX design
- Team communication and collaborative problem-solving

Thanks for checking out our quiz app! 💜  
