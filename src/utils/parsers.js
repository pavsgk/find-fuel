export function dbParser(locationList) {
  const vocabulary = locationList.reduce((vocab, location) => {
    for (const [key] of Object.entries(location)) {
      if (!(key in vocab)) {
        vocab[key] = [];
      }
      if (!vocab[key].includes(location[key])) {
        vocab[key].push(location[key]);
      }
    }
    return vocab;
  }, {})
  return vocabulary;
}

export function filterByField(locations, field, values, exclude = false) {
  if (!Array.isArray(values)) values = [values];

  return locations.filter(location => {
    const executor = exclude ? Array.prototype.every.bind(values) : Array.prototype.some.bind(values)
    
    return executor(item => {
      if (location[field]) {
        return Boolean((location[field].toLowerCase() === item.toLowerCase()) - exclude);
      }
    })
  });
}