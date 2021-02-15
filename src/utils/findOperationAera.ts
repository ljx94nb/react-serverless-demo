export const findOperationAera = (operationPath, districtPath) => {
  const points = window.turf.points(operationPath);
  // 行政区的边界（polygon）
  const searchWithin = window.turf.polygon([districtPath]);
  // 处于行政区内的点组成的polygon
  const pointsWithinPolygonFeature = window.turf.pointsWithinPolygon(points, searchWithin);
  // 组成的凹边形热点区域
  const concaveFeature = window.turf.concave(pointsWithinPolygonFeature, {
    units: 'miles',
    maxEdge: 1
  });
  // 圆滑的凹边形（Feature）
  const smoothed = window.turf.polygonSmooth(concaveFeature, { iterations: 3 });
  // 圆滑的凹边形（polygon）
  const smoothedPolygon = window.turf.polygon([smoothed.features[0].geometry.coordinates[0]]);
  // 和行政区的交集（polygon）
  const intersection = window.turf.intersect(searchWithin, smoothedPolygon);
  // console.log(districtPath, pointsWithinPolygonFeature, concaveFeature, intersection);
  return intersection;
};
