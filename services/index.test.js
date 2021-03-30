const Services = require('./index');

test('Return an empty list.', () => {
  const newService = new Services();
  expect(newService.getProvinces([])).toEqual({ provinces: [] });
});

test('Return a single province name.', () => {
  const newService = new Services();
  expect(newService.getProvinces([{ provincia_nombre: 'Kamtchatka' }])).toEqual(
    {
      provinces: ['Kamtchatka'],
    }
  );
});

test('Return an empty list -> departaments: []', () => {
  const newService = new Services();
  expect(newService.getDeparts([])).toEqual({ departaments: [] });
});
