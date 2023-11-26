exports.testsToRun = {
  controllers: {
    toggle: true,
    list: {
      pluralsight: {
        toggle: true,
        list: {
          codeMetrics: true,
        },
      },
    },
  },
  helpers: {
    toggle: false,
    list: {
      toggle: false,
      list: {
        date: {
          toggle: true,
          list: {
            getWeeksAgoDate: true,
          },
        },
      },
    },
  },
  services: {
    toggle: true,
    list: {
      pluralsight: {
        toggle: true,
        list: {
          teams: false,
          codingMetrics: false,
          collaboration: false,
          commits: false,
        },
      },
    }
  }
  {

},
}