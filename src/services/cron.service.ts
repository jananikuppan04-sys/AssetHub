import cron from 'node-cron';
import logger from '../utils/logger';
import { warrantyEngine } from './warranty.engine';
import { healthEngine } from './health.engine';

class CronService {
  initialize() {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
      logger.info('Running daily background jobs...');
      
      try {
        await warrantyEngine.checkWarranties();
        logger.info('Warranty check completed');
      } catch (error) {
        logger.error('Warranty engine error', error);
      }

      try {
        await healthEngine.updateAllHealthScores();
        logger.info('Health score update completed');
      } catch (error) {
        logger.error('Health engine error', error);
      }

    });
    logger.info('Cron jobs initialized');
  }
}

export const cronService = new CronService();
