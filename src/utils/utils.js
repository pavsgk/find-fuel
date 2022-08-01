function calculateDistance(latA, longA, latB, longB, km = true) {
  const degToRadian = deg => (deg * Math.PI) / 180;

  const earthRadius = km ? 6371 : 3958.8;
  const distLat = degToRadian(latB - latA);
  const distLong = degToRadian(longB - longA);
  const a = Math.sin(distLat / 2) * Math.sin(distLat / 2) + Math.cos(degToRadian(latA)) * 
    Math.cos(degToRadian(latB)) * Math.sin(distLong / 2) * Math.sin(distLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return earthRadius * c;
}

function generateRandomCoordinates(latLimit = 90, longLimit = 180) {
  const latFactor = Math.random() > 0.5 ? 1 : -1;
  const longFactor = Math.random() > 0.5 ? 1 : -1;
  return [Math.random() * latLimit * latFactor, Math.random() * longLimit * longFactor];
}

function generateCoordinates(lat, long, aproxRadius = 1000) {
  const rad = aproxRadius / 111300;
  const [u, v] = [Math.random(), Math.random()];
  const w = rad * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.sin(t);
  const y = (w * Math.cos(t)) / Math.cos(long);
  const newLat = lat + x;
  const newLong = long + y;
  return [newLat, newLong, calculateDistance(lat, long, newLat, newLong)];
}

export {calculateDistance, generateRandomCoordinates, generateCoordinates};

// impl b:
// function generateCoordinates(lat, long, aproxRadius = 1000) {
//   const rad = aproxRadius / 111300;
//   const [y0, x0] = [lat, long];
//   const [u, v] = [Math.random(), Math.random()];
//   const w = rad * Math.sqrt(u);
//   const t = 2 * Math.PI * v;
//   const x1 = (w * Math.cos(t)) / Math.cos(x0);
//   const y1 = w * Math.sin(t);
//   const newLat = y0 + y1;
//   const newLong = x0 + x1;
//   return [newLat, newLong, calculateDistance(lat, long, newLat, newLong)];
// }