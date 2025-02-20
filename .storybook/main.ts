import path from "path";

export default {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/nextjs",
    options: {
      image: {
        loading: "eager"
      },
      nextConfigPath: path.resolve(__dirname, "../next.config.js")
    }
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-mock/register",
    "@storybook/addon-styling-webpack",
    "storybook-addon-react-router-v6"
  ],
  logLevel: "debug",
  docs: {
    autodocs: true
  }
};
