export function calculateDistance(latA, longA, latB, longB, meters = true) {
  const degToRadian = deg => deg * Math.PI / 180;

  const earthRadius = meters ? 6371000 : 3958800;
  const distLat = degToRadian(latB - latA);
  const distLong = degToRadian(longB - longA);
  const a = Math.sin(distLat / 2) ** 2 + Math.cos(degToRadian(latA)) * 
    Math.cos(degToRadian(latB)) * Math.sin(distLong / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return earthRadius * c;
}