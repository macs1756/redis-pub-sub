module.exports = {
  apps: [
    {
      name: 'auth_template',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
