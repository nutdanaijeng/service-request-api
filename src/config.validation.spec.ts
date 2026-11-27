import { configValidationSchema } from './config.validation';

describe('configValidationSchema', () => {
  it('accepts a valid config and applies defaults', () => {
    const { error, value } = configValidationSchema.validate({
      DATABASE_URL: 'postgresql://app:secret@db:5432/appdb',
    });
    expect(error).toBeUndefined();
    expect(value.PORT).toBe(3000);
  });

  it('rejects a missing DATABASE_URL', () => {
    const { error } = configValidationSchema.validate({});
    expect(error?.message).toContain('DATABASE_URL');
  });
});
