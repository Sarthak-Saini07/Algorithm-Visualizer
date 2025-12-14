# Algorithm Visualizer 🚀

Algorithm Visualizer is a web-based interactive application designed to help users understand algorithms through clear, step-by-step visual execution. The project emphasizes clarity, structured learning, and performance awareness, making it suitable for computer science students, educators, and interview preparation.

The application visualizes how algorithms work internally rather than just showing final outputs. Each algorithm executes incrementally, allowing users to observe state changes, decisions, and transitions in real time.

---

## Objectives

The main objectives of this project are:
- To visualize algorithms step by step for deeper conceptual understanding
- To provide real-time insight into algorithm behavior and execution flow
- To enable comparison of multiple algorithms on the same input
- To build an interactive and structured learning platform for algorithms and data structures

---

## Features

- Step-by-step visualization of algorithms
- Playback controls including play, pause, forward, backward, and reset
- Support for multiple algorithm categories:
  - Sorting algorithms
  - Graph algorithms
  - Dynamic programming algorithms
  - Tree-based algorithms
- Custom user input for algorithm execution
- Real-time tracking of steps and operations
- Clean and learner-focused user interface
- Modular and extensible architecture

---

## Tech Stack

- Frontend: React with TypeScript
- Build Tool: Vite
- State Handling: Custom algorithm runner using generator functions
- Architecture: Component-based, modular design for scalability

---

## Project Structure

src/
├── algorithms/ Algorithm definitions, configurations, and generators
├── components/ Reusable UI components
├── visualizers/ Visualization logic for different algorithm types
├── state/ Algorithm runner and comparison state management
├── pages/ Application pages
└── App.tsx Application entry point


---

## How the System Works

1. The user selects an algorithm and provides input
2. Each algorithm is implemented as a generator function
3. The generator yields intermediate steps instead of returning a final result
4. Each yielded step updates a visual state
5. Visualizers render the state changes on screen
6. Playback controls allow users to navigate forward and backward through execution

This approach cleanly separates algorithm logic from visualization logic, making the system easier to debug, extend, and maintain.

---

