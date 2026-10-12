import { CategoryLabelPipe } from './category-label.pipe';

describe('CategoryLabelPipe', () => {
  const pipe = new CategoryLabelPipe();

  it('maps every known category to its label', () => {
    expect(pipe.transform('technology')).toBe('Tecnología');
    expect(pipe.transform('networks')).toBe('Redes');
    expect(pipe.transform('security')).toBe('Ciberseguridad');
    expect(pipe.transform('ai')).toBe('IA');
  });

  it('falls back to the raw value for an unknown category', () => {
    expect(pipe.transform('otra' as never)).toBe('otra');
  });
});
