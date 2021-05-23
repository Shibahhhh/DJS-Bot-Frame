module.exports = async (client) => {
    console.log(`Bot is online`);
    //set status
    client.user.setActivity("test");
}