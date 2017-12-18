export const calculateDistance = (coordA, coordB) => {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((coordB.latitude - coordA.latitude) * p)/2 +
    c(coordA.latitude * p) * c(coordB.latitude * p) *
    (1 - c((coordB.longitude - coordA.longitude) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a));
};
