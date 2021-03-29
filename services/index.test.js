const Services = require('./index');

test('Empty list should return empty provinces', () => {
  const newService = new Services();
  expect(newService.getProvinces([])).toEqual({ provinces: [] });
});

test('Contains an element', () => {
  const newService = new Services();
  expect(newService.getProvinces([{ provincia_nombre: 'Salta' }])).toEqual({
    provinces: ['Salta'],
  });
});
