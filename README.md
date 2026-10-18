# Chem FT ⚗️

An interactive revision site for **F.3 Chemistry, Chapters 0–2**:

| Chapter | Topics |
| --- | --- |
| 🧪 Ch 0 Introduction to Chemistry | What chemistry is, lab rules and safety precautions, recording observations (Experiment 0.1) |
| ⚛️ Ch 1 Elements | Particle diagrams, chemical symbols, atoms vs molecules, metals / semi-metals / non-metals, allotropes of carbon (Experiment 1.1) |
| ⚗️ Ch 2 Compounds & Mixtures | Compounds, mixtures, alloys, air, physical vs chemical changes, electrolysis of water, balancing equations (Experiments 2.1–2.3) |

Each lesson has short notes, games and virtual experiments, then a quick check. The **Exam Zone** has chapter tests, a timed mock exam, a 90-second speed run, a daily 5-question set, and a list of your mistakes to retry. Progress and XP are saved in your browser.

**Live site:** https://nethken284-debug.github.io/chem-ft/

## Run locally

It's a static site with no build step. Serve the folder with any web server:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html        app shell
css/style.css     design system (light + dark)
js/core.js        state, quiz engine, shared widgets (sort, match, cloze, flashcards, particle diagrams)
js/ch0.js …       chapter content: lessons, games, question bank, glossary
js/exam.js        Exam Zone
js/app.js         router, home page, glossary
```
