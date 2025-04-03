module.exports = {
  apps: [
    {
      name: "taskapp-backend",
      script: "/home/nayeem/Desktop/web_server/pernTodo_mernTask/task/server/server.js",
      env: {
        // PORT: 9000,
        NODE_ENV: "production"
      }
    },
    {
      name: "todoapp-backend",
      script: "/home/nayeem/Desktop/web_server/pernTodo_mernTask/todo/server/server.js",
      env: {
        // PORT: 8000,
        NODE_ENV: "production"
      }
    }
  ]
};