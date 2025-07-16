# E-Commerce Site

## Backend Setup

1. Go to the `backend` folder
2. Run `npm install express mongoose cors dotenv`
3. Create a `.env` file with:

```
MONGO_URI=your_mongodb_connection_string
```

4. Run the server:
```bash
node server.js
```

## Frontend Setup

1. Go to the `frontend` folder
2. Run `npx create-react-app .`
3. Run `npm install -D tailwindcss postcss autoprefixer`
4. Run `npx tailwindcss init -p`
5. Replace `src/index.css` and `tailwind.config.js` with the ones provided.
6. Start the app:
```bash
npm start
```
