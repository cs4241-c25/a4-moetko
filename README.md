## To-Do List ##
**NOTE** : The To-Do list works locally, but when deploying on Vercel, there are routing issues that I can't seem to figure out how to fix. I screen recorded the To-Do list which works on my computer.
Recording of To-Do list: 

**Download the video and View Raw**: (https://github.com/cs4241-c25/a4-moetko/blob/main/to-do-list.mov)
OR
**View video** https://youtu.be/auW-2T0aT10
**Running the application**
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Start the backend:
   ```bash
   node app.js
   ```

2. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.


Moet O'Donnell: https://a4-moetko.vercel.app  


This project is a To-Do List Web App that allows users to manage tasks, mark them as completed, and edit or delete them. The app uses React (Frontend), Express (Backend), MongoDB (Database), and GitHub OAuth for authentication.

## Changes from Assignment 3 ##
- Reimplemented a3 to use React components
- Changed the authorizing from localstorage to GitHub Passport
