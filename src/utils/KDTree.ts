export default class KDTree {
  private root: KDTreeNode | null;
  private dims: number;

  constructor(points: number[][]) {
    this.dims = points[0].length;
    this.root = this.build(this.preprocess(points), 0);
  }

  private preprocess(points: number[][]): KDTreePoint[] {
    const data: KDTreePoint[] = [];

    // apply normalization values
    for (let i = 0; i < points.length; i++) {
      data.push({
        id: i,
        value: points[i],
      });
    }

    return data;
  }

  private build(points: KDTreePoint[], depth: number): KDTreeNode | null {
    if (points.length === 0) {
      return null;
    }

    const axis = depth % this.dims;
    const sortedPoints = points.slice().sort((a, b) => a.value[axis] - b.value[axis]);
    const medianIndex = Math.floor(sortedPoints.length / 2);

    return {
      point: sortedPoints[medianIndex],
      left: this.build(sortedPoints.slice(0, medianIndex), depth + 1),
      right: this.build(sortedPoints.slice(medianIndex + 1), depth + 1),
    };
  }

  private euclideanDistance(x: number[], y: number[]): number {
    return Math.sqrt(x.reduce((sum, x, i) => sum + Math.pow(x - y[i], 2), 0));
  }

  private kNearestPoints(target: number[], current: KDTreeNode | null, depth: number, k: number, nearestNeighbors: KDTreeNeighbor[]): void {
    if (current === null) {
      return;
    }

    const axis = depth % this.dims;
    const isLeftSubtree = target[axis] < current.point.value[axis];
    const [nextNode, alternateNode] = isLeftSubtree ? [current.left, current.right] : [current.right, current.left];
    const currentDistance = this.euclideanDistance(target, current.point.value);

    const currentNeighbor: KDTreeNeighbor = {
      point: current.point,
      distance: currentDistance,
    };

    if (nearestNeighbors.length < k) {
      nearestNeighbors.push(currentNeighbor);
      nearestNeighbors.sort((a, b) => a.distance - b.distance);
    } else if (currentDistance < nearestNeighbors.at(-1)!.distance) {
      nearestNeighbors.pop();
      nearestNeighbors.push(currentNeighbor);
      nearestNeighbors.sort((a, b) => a.distance - b.distance);
    }

    this.kNearestPoints(target, nextNode, depth + 1, k, nearestNeighbors);

    // if current distance is smaller than worst returnable distance, explore opposite subtree
    if (currentDistance < nearestNeighbors.at(-1)!.distance) {
      this.kNearestPoints(target, alternateNode, depth + 1, k, nearestNeighbors);
    }
  }

  public knn(target: number[], k: number = 1): KDTreePoint[] {
    if (!this.root || k <= 0) return [];

    const nearestNeighbors: KDTreeNeighbor[] = [];
    this.kNearestPoints(target, this.root, 0, k, nearestNeighbors);
    return nearestNeighbors.map((node) => node.point);
  }
}

type KDTreeNode = {
  point: KDTreePoint;
  left: KDTreeNode | null;
  right: KDTreeNode | null;
};

type KDTreePoint = {
  id: number;
  value: number[];
};

type KDTreeNeighbor = {
  distance: number;
  point: KDTreePoint;
};
