/**
 * Represents a node in a k-dimensional tree.
 */
interface KDNode {
  point: number[];
  left: KDNode | null;
  right: KDNode | null;
}

/**
 * Represents a k-dimensional tree.
 */
export default class KDTree {
  private root: KDNode | null;

  /**
   * Constructs a KDTree object and builds the tree from the given points.
   * @param points - An array of points in the k-dimensional space.
   */
  constructor(points: number[][]) {
    this.root = this.buildTree(points, 0);
  }

  /**
   * Recursively builds the KDTree using the given points and depth.
   * @param points - An array of points in the k-dimensional space.
   * @param depth - The current depth in the tree.
   * @returns The root node of the constructed KDTree.
   */
  private buildTree(points: number[][], depth: number): KDNode | null {
    if (points.length === 0) {
      return null;
    }

    const axis = depth % points[0].length;
    const sortedPoints = points.slice().sort((a, b) => a[axis] - b[axis]);
    const medianIndex = Math.floor(sortedPoints.length / 2);

    return {
      point: sortedPoints[medianIndex],
      left: this.buildTree(sortedPoints.slice(0, medianIndex), depth + 1),
      right: this.buildTree(sortedPoints.slice(medianIndex + 1), depth + 1),
    };
  }

  /**
   * Calculates the Euclidean distance between two points.
   * @param point1 - The first point.
   * @param point2 - The second point.
   * @returns The Euclidean distance between the two points.
   */
  private euclideanDistance(point1: number[], point2: number[]): number {
    return Math.sqrt(point1.reduce((sum, coord, index) => sum + Math.pow(coord - point2[index], 2), 0));
  }

  /**
   * Finds the closest point to the target point in the KDTree.
   * @param target - The target point.
   * @param current - The current node being visited.
   * @param depth - The current depth in the tree.
   * @param best - The best point found so far.
   * @returns The closest point to the target point.
   */
  private closestPoint(target: number[], current: KDNode | null, depth: number, best: KDNode | null): KDNode | null {
    if (current === null) {
      return best;
    }

    const axis = depth % target.length;
    const isLeftSubtree = target[axis] < current.point[axis];
    const nextNode = isLeftSubtree ? current.left : current.right;
    const alternateNode = isLeftSubtree ? current.right : current.left;
    const bestDistance = best ? this.euclideanDistance(target, best.point) : Infinity;
    const currentDistance = this.euclideanDistance(target, current.point);

    let nextBest = best;
    if (currentDistance < bestDistance) {
      nextBest = current;
    }

    nextBest = this.closestPoint(target, nextNode, depth + 1, nextBest);

    if (this.euclideanDistance(target, current.point) < bestDistance) {
      nextBest = this.closestPoint(target, alternateNode, depth + 1, nextBest);
    }

    return nextBest;
  }

  /**
   * Finds the nearest neighbor to the target point in the KDTree.
   * @param target - The target point.
   * @returns The nearest neighbor point to the target point, or null if the tree is empty.
   */
  public nearestNeighbor(target: number[]): number[] | null {
    const closestNode = this.closestPoint(target, this.root, 0, null);
    return closestNode ? closestNode.point : null;
  }
}
