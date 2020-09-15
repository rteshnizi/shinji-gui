# GUI
The front-end for the word grouping exercise.

## Live Demo
https://icy-ground-0a06e3c10.azurestaticapps.net/

## Getting Started
1. Install dependencies: `npm install`
2. Run the application in development mode: `npm start`

## Summary of the Code
This code is implemented in ReactJs + MUI + TypeScript using the CRA template.

I have tried to leave comments in the source when necessary.
Generally, the code is straightforward and I have tried to use descriptive variable names to make it easy to follow.
I personally prefer longer but more descriptive variable/function names than adding comments.

A few things to note:
1. I have only tested this GUI in Firefox as it is my main browser.
2. I have used Class Components. I strongly prefer Class Components over Function Components as it enforces better OOD and improves extensibility.
3. This GUI was not tested with a big dataset. I have only used the provided test data.
4. There are better/prettier ways to implement a GUI for this task, but this is a proof of concept.
5. Please forgive the aesthetics xD. I didn't spend time designing the MUI theme.

## `src` Folder Hierarchy
* **./**: Contains the root of the React application. The application entry is `index.tsx`. The logic of the application begins at `App.tsx`
* **Base**: Contains common type definitions and base classes.
* **Components**: Contains reusable React components.
* **Utils**: Contains utility classes and methods.
