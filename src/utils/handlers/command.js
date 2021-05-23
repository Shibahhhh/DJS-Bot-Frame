
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Commands");
table.setHeading("Command", "Status");

//NEW MODULE
module.exports = client => {
  if(client.shard.ids[0] === 0) console.log('Initializing Commands...')
  readdirSync("./src/commands").forEach(dir => {
    const commands = readdirSync(`./src/commands/${dir}/`).filter(file =>
      file.endsWith(".js")
    );
 
for (let file of commands) {
      let pull = require(`../../commands/${dir}/${file}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, "Pass");
      } else {
        table.addRow(
          file,
          `Fail`
        );
        continue;
      }

    }
  });
  

  if(client.shard.ids[0] === 0) console.log(table.toString());
};
