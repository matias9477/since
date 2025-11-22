import { formatTimeSince } from '@/lib/formatTimeSince';

describe('formatTimeSince', () => {
  const mockNow = new Date('2024-01-15T12:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('days unit', () => {
    it('should format single day correctly', () => {
      const startDate = new Date('2024-01-14T12:00:00Z');
      expect(formatTimeSince(startDate, 'days')).toBe('1 day');
    });

    it('should format multiple days correctly', () => {
      const startDate = new Date('2024-01-10T12:00:00Z');
      expect(formatTimeSince(startDate, 'days')).toBe('5 days');
    });

    it('should handle zero days', () => {
      const startDate = new Date('2024-01-15T12:00:00Z');
      expect(formatTimeSince(startDate, 'days')).toBe('0 days');
    });
  });

  describe('weeks unit', () => {
    it('should format single week correctly', () => {
      const startDate = new Date('2024-01-08T12:00:00Z');
      expect(formatTimeSince(startDate, 'weeks')).toBe('1 week');
    });

    it('should format multiple weeks correctly', () => {
      const startDate = new Date('2024-01-01T12:00:00Z');
      expect(formatTimeSince(startDate, 'weeks')).toBe('2 weeks');
    });

    it('should format weeks with remaining days correctly', () => {
      const startDate = new Date('2024-01-12T12:00:00Z');
      expect(formatTimeSince(startDate, 'weeks')).toBe('0 weeks and 3 days');
    });

    it('should format weeks and days correctly', () => {
      const startDate = new Date('2024-01-06T12:00:00Z');
      expect(formatTimeSince(startDate, 'weeks')).toBe('1 week and 2 days');
    });
  });

  describe('months unit', () => {
    it('should format single month correctly', () => {
      const startDate = new Date('2023-12-15T12:00:00Z');
      expect(formatTimeSince(startDate, 'months')).toBe('1 month');
    });

    it('should format multiple months correctly', () => {
      const startDate = new Date('2023-11-15T12:00:00Z');
      expect(formatTimeSince(startDate, 'months')).toBe('2 months');
    });

    it('should format months with remaining days correctly', () => {
      const startDate = new Date('2023-12-20T12:00:00Z');
      const result = formatTimeSince(startDate, 'months');
      expect(result).toMatch(/^\d+ months? and \d+ days?$/);
    });

    it('should format months and days correctly', () => {
      const startDate = new Date('2023-12-10T12:00:00Z');
      const result = formatTimeSince(startDate, 'months');
      expect(result).toMatch(/^\d+ months? and \d+ days?$/);
    });
  });

  describe('years unit', () => {
    it('should format single year correctly', () => {
      const startDate = new Date('2023-01-15T12:00:00Z');
      expect(formatTimeSince(startDate, 'years')).toBe('1 year');
    });

    it('should format multiple years correctly', () => {
      const startDate = new Date('2022-01-15T12:00:00Z');
      expect(formatTimeSince(startDate, 'years')).toBe('2 years');
    });

    it('should format years with months correctly', () => {
      const startDate = new Date('2023-02-15T12:00:00Z');
      const result = formatTimeSince(startDate, 'years');
      expect(result).toMatch(/^\d+ years? \d+ months?$/);
    });
  });
});

