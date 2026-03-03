const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = (question) =>
  new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));

async function setup() {
  console.log('\n--- Bitcraft Job Bot Setup ---');
  console.log('This will create a .env file with your Discord bot credentials.');
  console.log('View Readme.md for instructions on each step.');

  if(fs.existsSync('.env')) {
    console.log('WARNING: A .env file already exists. This script will overwrite it.');
  }
  console.log(`\n`);

  const DISCORD_CLIENT_ID = await ask('Paste your Discord Application ID: ');
  const DISCORD_TOKEN = await ask('Paste your Discord bot auth token: ');
  const BOT_REPORT_CHANNEL_ID = await ask('Paste a channel ID for bot debug messages: ');
  const ADMIN_DISCORD_USER_ID = await ask('Paste your Discord user ID for admin commands: ');

  rl.close();

  const envContent = [
    `DISCORD_TOKEN=${DISCORD_TOKEN}`,
    `DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}`,
    `BOT_REPORT_CHANNEL_ID=${BOT_REPORT_CHANNEL_ID}`,
    `ADMIN_DISCORD_USER_ID=${ADMIN_DISCORD_USER_ID}`,
  ].join('\n');

  fs.writeFileSync('.env', envContent + '\n', 'utf8');
  console.log('\nSaved to .env\n');
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});
