# Makthabthul-husnain

Simple Node.js / Express fullstack app for managing books.

## Quick local setup

- Install dependencies:

```bash
npm install
```

- Create a `.env` file (optional for local dev) with at least:

```
MONGODB_URI=mongodb://127.0.0.1:27017/library
SESSION_SECRET=your_session_secret
PORT=3000
```

- Run locally:

```bash
node app.js
# or for development with auto-reload if you have nodemon installed
npm start
```

App entry: `app.js` (server listens on `process.env.PORT` or 3000).

## Deploying to DigitalOcean App Platform

This project works well on DigitalOcean App Platform (or similar platforms). Steps:

1. Push your repository to GitHub (or connect your Git provider).

2. Create a MongoDB Atlas cluster (free tier) and get the connection string:

   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster, create a database user (username/password), and allow your app's IP(s) (or 0.0.0.0/0 while testing).
   - From the Atlas UI select "Connect" → "Connect your application" and copy the connection string. Replace `<password>` and `<dbname>` with your values. Example:

```
mongodb+srv://dbuser:DBPASSWORD@cluster0.abcd.mongodb.net/library?retryWrites=true&w=majority
```

3. In DigitalOcean App Platform, create a new App and connect your Git repo. For the service settings use:

   - Environment: `Node.js`
   - Run Command: `node app.js`
   - Build Command: leave empty (DigitalOcean will run `npm install` by default) or use `npm install`
   - HTTP Port: `3000` (or leave default and set `PORT` env var)

4. Set Environment Variables in the App settings:

```
MONGODB_URI=<your Atlas connection string>
SESSION_SECRET=<a secure random string>
PORT=3000
```

5. Deploy. Monitor the logs in DigitalOcean for any errors.

Notes:

- The app currently reads the DB connection from `config/connection.js`. Make sure `process.env.MONGODB_URI` is set in the App Platform environment variables.
- If you need to re-import `books.csv`, either upload it to the server or use the admin UI import (the app expects `books.csv` at repository root for the current import script).

## Post-deploy checks

- Visit `/admin/login` and log in with your admin account.
- Visit `/admin` to verify books and try the import button if needed.

## Security recommendations

- Do not keep `scripts/createAdmin.js` in a public repo with real credentials; remove or restrict it after use.
- Use a strong `SESSION_SECRET` and do not commit it to source control.
- Restrict Atlas IP access to your App Platform's outbound IPs in production.

## Troubleshooting

- If the app cannot connect to MongoDB, verify the `MONGODB_URI` and Atlas network/credentials.
- Check DigitalOcean App logs for stack traces and missing env vars.

If you want, I can also:
- Add a `Procfile` for Heroku-style deploys.
- Update `package.json` start script to `node app.js` for production.
- Add instructions to upload `books.csv` via the UI instead of bundling it in the repo.
