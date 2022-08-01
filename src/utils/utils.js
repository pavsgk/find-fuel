export function calculateDistance(latA, longA, latB, longB, km = true) {
  const degToRadian = deg => (deg * Math.PI) / 180;

  const earthRadius = km ? 6371 : 3958.8;
  const distLat = degToRadian(latB - latA);
  const distLong = degToRadian(longB - longA);
  const a = Math.sin(distLat / 2) * Math.sin(distLat / 2) + Math.cos(degToRadian(latA)) * 
    Math.cos(degToRadian(latB)) * Math.sin(distLong / 2) * Math.sin(distLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return earthRadius * c;
}

export function generateRandomCoordinates(latLimit = 90, longLimit = 180) {
  const latFactor = Math.random() > 0.5 ? 1 : -1;
  const longFactor = Math.random() > 0.5 ? 1 : -1;
  return [Math.random() * latLimit * latFactor, Math.random() * longLimit * longFactor];
}

export function generateCoordinates(lat, long, radius) {
  const direction = () => Math.random() > 0.5 ? 1 : -1;
  const shiftLimit = radius / 111000;
  const latShift = (Math.random() * shiftLimit) * direction();
  const longShift = (Math.random() * shiftLimit) * direction();

  const result = [lat + latShift, long + longShift];

  return [...result, calculateDistance(lat, long, result[0], result[1])];
}