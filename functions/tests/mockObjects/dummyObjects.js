exports.dummyCollaborationMetrics = {
  metric_1: 10,
  metric_2: 10,
};

exports.dummyCollaborationMetricBaselines = {
  metric_1: 5,
  metric_2: 5,
};

exports.dummyCollaborationMetricsWeekly = {
  metric_1: 10 / 7,
  metric_2: 10 / 7,
};

exports.dummyCollaborationMetricBaselinesWeekly = {
  metric_1: 5 / 7,
  metric_2: 5 / 7,
};

exports.dummyComparisonResponse = {
  metric_1: {
    current: 10 / 7,
    baseline: 5 / 7,
    ratio: (10 / 7) / (5 / 7),
  },
  metric_2: {
    current: 10 / 7,
    baseline: 5 / 7,
    ratio: (10 / 7) / (5 / 7),
  },
};
