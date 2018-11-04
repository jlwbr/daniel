const fs = require("fs");
const expect = require("chai").expect;

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

describe("commands", () => {
  it("all commands should have required fields, and types", () => {
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      expect(command.name).to.not.be.undefined;
      expect(command.description).to.not.be.undefined;
      expect(command.execute).to.be.a("function");
    }
  });
});
