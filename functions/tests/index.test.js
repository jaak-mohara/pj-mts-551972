jest.mock('moment', () => {
  return (suppliedDate = null) => {
    const dateToUse = '2023-11-25';
    if (suppliedDate) {
      dateToUse = suppliedDate;
    }
    jest.requireActual('moment')(`${}T00:00:00.000Z`);
  };
});