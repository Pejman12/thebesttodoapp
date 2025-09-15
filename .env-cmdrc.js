const wrangler = require("./wrangler.json");

const envs = Object.entries(wrangler.env).reduce(
  (acc, [env, { vars }]) => ({
    ...acc,
    [env]: vars,
  }),
  {},
);

Object.assign(envs, { production: wrangler.vars });

module.exports = envs;
