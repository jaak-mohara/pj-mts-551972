/**
 * Parses the collaboration object to look similar to the coding metrics.
 *
 * @param {object} collaboration
 *
 * @return {object}
 */
exports.collaborationParser = (collaboration) => {
  return Object.keys(collaboration)
    .map((key) => {
      if (typeof collaboration[key] === 'object') {
        return { [key]: collaboration[key].average };
      }

      return { [key]: collaboration[key] };
    })
    .reduce((acc, cur) => {
      const key = Object.keys(cur)[0];
      acc[key] = cur[key];
      return acc;
    }, {});
};
