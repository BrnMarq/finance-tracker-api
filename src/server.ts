import app from './app';
import { startDailyJob } from './jobs/dailyPriceJob';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startDailyJob();
});
