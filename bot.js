require('dotenv').config();
const { SettingsLoader, settingKeys } = require('./core/SettingsLoader');
const { Cache } = require('./core/Cache');
const { DiscordClientWrapper } = require('./core/DiscordClientWrapper');
const { pollCraftsOnTimer } = require('./utils/pollCraftsOnTimer');
const { SubscriptionsManager } = require('./core/SubscriptionsManager');
const { icons } = require('./utils/iconMap');



// Connect bot
(async () => {
  try {
    //Load settings
    SettingsLoader.setup();
    console.log(`Settings setup complete ${icons.success}`);

    //Setup subscriptions
    SubscriptionsManager.setup();
    console.log(`Subscriptions setup complete: ${SubscriptionsManager.getSubscriptions().length} subscriptions loaded ${icons.success}`);

    //Setup cache
    const cache = new Cache();
    cache.setup();
    console.log(`Cache setup complete ${icons.success}`);


    
    const discordClientWrapper = new DiscordClientWrapper();
    await discordClientWrapper.setup();
    console.log(`Discord client wrapper setup complete ${icons.success}`);
    

    pollCraftsOnTimer(cache, discordClientWrapper);
    const intervalSeconds = SettingsLoader.getSetting(settingKeys.POLL_CRAFTS_INTERVAL_SECONDS, 60);
    setInterval(() => {
      pollCraftsOnTimer(cache, discordClientWrapper);
    }, intervalSeconds * 1000);

    // Poll for notifications every 60 seconds
    //setInterval(()=>{DiscordPollNotifications(discordClient, runState)}, 60000);
    //await DiscordPollNotifications(discordClient, runState);
  } catch (err) {
    console.error('Startup error:', err);
  }
})();
