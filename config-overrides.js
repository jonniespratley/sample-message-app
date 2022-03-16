module.exports = function override(config, env) {
    console.warn('Config Override', config, env);
    config.resolve.fallback = {
      fs: false,
      crypto: false,
      buffer: false,
      stream: false,
      querystring: false,
      os: false,
      url: false,
    };
    return config;
  };