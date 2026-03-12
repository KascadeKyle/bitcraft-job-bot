# Bitcraft Job Bot

![Screenshot](https://i.gyazo.com/39f715b2405fee059c68243dc340cc90.png)

- Subscribe to a claim to see all public crafts
- Filter by item, skill, craft size, etc
- Progress bars update automatically 
- Differentiate between crafts from claim members and guests
- Messages the channel when a new craft is added
- Cleans up after itself
- No database required, subscriptions are persisted in a json file

#  Setup Guide (Beginner Friendly)
## Step 1 – Install Node.js

If you don't already have Node.js:

1. Go to: **https://nodejs.org**
2. Install it using the default options.
3. After installing, open a terminal (or Command Prompt) and run:

   ```bash
   node -v
   npm -v
   ```

   If both show version numbers, you're ready.


## Step 2 – Install Project Dependencies

1. Open a terminal **inside your project folder**.
2. Run:

   ```bash
   npm install
   ```

   This installs all required packages listed in `package.json`.
3. You **must** do this before running the bot.


## Step 3 – Create a Discord Application

1. Go to the **Discord Developer Portal**:  
   **https://discord.com/developers/applications**
2. Click **"New Application"**
3. Give it a name (ex: *Bitcraft Job Bot*)
4. Click **Create**


## Step 4 – Add a Bot to the Application

1. On the left sidebar, click **Bot**
2. Click **Add Bot**
3. Click **Yes, do it!**
4. Now you have a Discord bot.


## Step 5 – Get Your Bot Token

1. In the **Bot** section
2. Click **Reset Token** (if needed)
3. Click **Copy**

**IMPORTANT:**  
Never share this token with anyone. It gives full control over your bot.

You'll paste this into the setup script later.


## Step 6 – Get Your Application (Client) ID

1. Click **General Information** (left sidebar)
2. Copy the **Application ID**
3. You'll need this for setup.


## Step 7 – Invite the Bot to Your Server

1. Go to **OAuth2 → URL Generator**
2. Under **Scopes**, check:
   - **bot**
   - **applications.commands**
3. Under **Bot Permissions**, select the permissions your bot needs.  
   This bot only needs:
   - **Send Messages**
4. Copy the generated URL at the bottom.
5. Give this link to the server owner. If the owner is you - open it in your browser.
6. Select your server.
7. Click **Authorize**.

Your bot is now in your server.


## Step 8 – Enable Developer Mode (to get IDs)

To get Channel IDs and your User ID:

1. Open Discord
2. Go to **User Settings → Advanced**
3. Enable **Developer Mode**
4. Now you can right-click things and **Copy** their IDs.


## Step 9 – Get Required IDs

You will need:

**1. Bot Report Channel ID**

- Create a new channel in the server your bot belongs to for debug messages
- Right-click the debug channel 
- Click **Copy ID**

**2. Your Discord User ID (Admin ID)**

- Right-click your username (on the right sidebar of any server you belong to)
- Click **Copy ID**


## Step 10 – Run the Setup Script

This project includes a setup helper: **`setup.js`**

Run:

```bash
node setup.js
```

It will ask you for:

- Discord Application ID
- Discord Bot Token
- Bot Report Channel ID
- Your Discord User ID

It will automatically create a `.env` file for you.


## Step 11 – Start the Bot

After setup is complete, start the bot with:

```bash
node bot.js
```

If everything is correct, your bot should come online in your Discord server.

You'll see a green **"Online"** indicator next to it.


## Optional: Make bot run automatically with pm2

[pm2](https://pm2.keymetrics.io/) keeps your bot running in the background and can restart it if it crashes or after a reboot.

1. Install pm2 globally:

   ```bash
   npm install -g pm2
   ```

2. From your project folder, start the bot with pm2:

   ```bash
   pm2 start bot.js --name bitcraft-job-bot
   ```

3. Useful commands:
   - `pm2 monit` – live dashboard (CPU, memory, logs)
   - `pm2 status` – see if the bot is running
   - `pm2 logs bitcraft-job-bot` – view logs
   - `pm2 stop bitcraft-job-bot` – stop the bot
   - `pm2 restart bitcraft-job-bot` – restart the bot

4. (Optional) Start the bot on system boot:

   ```bash
   pm2 startup
   pm2 save
   ```


## Troubleshooting

**Bot not coming online?**

- Make sure you ran `npm install`
- Make sure your `.env` file exists
- Double-check your token
- Make sure the bot was invited to the server

**Getting "Missing Access" errors?**

- Check the bot permissions in the server settings
- Make sure it has permission to send messages in that channel


## Important Security Notes

- **Never** upload your `.env` file to GitHub.
- **Never** share your bot token.
- If you accidentally leak your token, **reset it immediately** in the Developer Portal.


## Settings

You can adjust behavior in `settings.json`. Restart the bot after changing settings.

| Setting | Description |
|--------|-------------|
| **CACHE_FILE_PATH** | File path for the in-memory cache backup (e.g. `cache.json`). |
| **WRITE_CACHE_FILE** | If `true`, the bot writes the cache to disk; if `false`, cache is memory-only. |
| **ALL_CRAFTS_EXPIRE_SECONDS** | How long (in seconds) the "all crafts" API response is cached before refetching. |
| **CLAIM_MEMBERS_EXPIRE_SECONDS** | How long (in seconds) claim-members data is cached before refetching. |
| **NEW_CRAFTS_EXPIRE_SECONDS** | How long (in seconds) "new crafts" data is cached before refetching. |
| **POLL_CRAFTS_INTERVAL_SECONDS** | How often (in seconds) the bot polls for new crafts and notifies subscribed channels. |


## You're Done!

Your Discord bot should now be fully set up and running.

If you ever move the project to a new machine:

1. Clone/download the project
2. Run `npm install`
3. Run `node setup.js`
4. Start the bot with `node bot.js`
