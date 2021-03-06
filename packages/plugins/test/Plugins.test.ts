import { Plugin, Plugins } from "../lib";
import path from "path";
const originalRequire = require("original-require");

describe("Plugins", () => {
  // Add fixture folder to require path so dummy plugins can be found
  originalRequire("app-module-path").addPath(
    path.resolve(__dirname, "fixture")
  );

  describe("listAll()", () => {
    it("should list all plugins defined in a Truffle config object", () => {
      const config = {
        working_directory: __dirname,
        plugins: ["dummy-plugin-1", "dummy-plugin-2"]
      };

      const allPlugins = Plugins.listAll(config);

      const expectedPlugins = [
        new Plugin({
          module: "dummy-plugin-1",
          definition: { commands: { "dummy-command-1": "index.js" } }
        }),
        new Plugin({
          module: "dummy-plugin-2",
          definition: { commands: { "dummy-command-2": "index.js" } }
        })
      ];

      expect(allPlugins).toEqual(expectedPlugins);
    });

    it("should filter duplicate plugins", () => {
      const config = {
        working_directory: __dirname,
        plugins: ["dummy-plugin-1", "dummy-plugin-1"]
      };

      const allPlugins = Plugins.listAll(config);

      const expectedPlugins = [
        new Plugin({
          module: `dummy-plugin-1`,
          definition: { commands: { "dummy-command-1": "index.js" } }
        })
      ];

      expect(allPlugins).toEqual(expectedPlugins);
    });

    it("should throw an error when a listed plugin cannot be found", () => {
      const config = {
        working_directory: __dirname,
        plugins: ["non-existent-plugin"]
      };

      const expectedError = /listed as a plugin, but not found in global or local node modules/;

      expect(() => Plugins.listAll(config)).toThrow(expectedError);
    });

    it("should throw an error when a listed plugin does not contain a truffle-plugin.json file", () => {
      const config = {
        working_directory: __dirname,
        plugins: ["jest"]
      };

      const expectedError = /truffle-plugin\.json not found/;

      expect(() => Plugins.listAll(config)).toThrow(expectedError);
    });
  });

  describe("findPluginsForCommand()", () => {
    it("should find all plugins that implement a given command", () => {
      const config = {
        working_directory: __dirname,
        plugins: ["dummy-plugin-1", "dummy-plugin-2", "dummy-plugin-2-copy"]
      };

      const foundPlugins = Plugins.findPluginsForCommand(
        config,
        "dummy-command-2"
      );

      const expectedPlugins = [
        new Plugin({
          module: "dummy-plugin-2",
          definition: { commands: { "dummy-command-2": "index.js" } }
        }),
        new Plugin({
          module: "dummy-plugin-2-copy",
          definition: { commands: { "dummy-command-2": "index.js" } }
        })
      ];

      expect(foundPlugins).toEqual(expectedPlugins);
    });
  });
});
