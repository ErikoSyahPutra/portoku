module.exports = {
  apps: [
    {
      name: 'portfolio-backend',
      cwd: './backend',
      script: './server',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        PORT: 3001,
      },
    },
    {
      name: 'portfolio-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
