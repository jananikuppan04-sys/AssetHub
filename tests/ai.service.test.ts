import { aiService } from '../src/services/ai.service';

describe('AI Service Engine', () => {
  it('should return maintenance insights for maintenance queries', async () => {
    const response = await aiService.askQuestion('Which laptops require maintenance?');
    expect(response).toContain('15 assets are currently in maintenance');
    expect(response).toContain('Critical Risk');
  });

  it('should return warranty insights for warranty queries', async () => {
    const response = await aiService.askQuestion('List assets with expired warranty.');
    expect(response).toContain('45 assets with warranties expiring');
  });

  it('should return a generic prompt for unknown queries', async () => {
    const response = await aiService.askQuestion('Tell me a joke');
    expect(response).toContain('I can help you analyze asset health');
  });
});
