import app from './app.js';
import { ENV } from './config/env.config.js';
import { connectDatabase } from './config/db.config.js';

const startServer = async () => {
  await connectDatabase();

  const PORT = ENV.PORT;
  app.listen(PORT, () => {
    console.log(`🚀 [FundNova Server] Running on http://localhost:${PORT}`);
    console.log(`🏥 [Health Check] Available at http://localhost:${PORT}/api/health`);
  });
};

startServer().catch((err) => {
  console.error('Failed to launch FundNova server:', err);
});
