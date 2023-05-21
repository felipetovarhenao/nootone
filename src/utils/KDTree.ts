export default class KDTree {
  private k: number;
  private root: KDNode | null;

  /**
   * Initializes a KDTree with the specified number of dimensions.
   * @param k The number of dimensions for the points in the KDTree.
   */
  constructor(k: number) {
    this.k = k;
    this.root = null;
  }

  /**
   * Constructs the KDTree from the given points.
   * @param X An array of points, where each point is an array of numbers.
   */
  fit(X: number[][]): void {
    this.root = this.buildTree(X, 0);
  }

  /**
   * Recursively builds the KDTree by dividing the points based on the current depth.
   * @param X An array of points, where each point is an array of numbers.
   * @param depth The current depth in the KDTree.
   * @returns The root node of the constructed KDTree.
   */
  private buildTree(X: number[][], depth: number): KDNode | null {
    if (X.length === 0) {
      return null;
    }

    const axis = depth % this.k;
    const sortedX = X.sort((a, b) => a[axis] - b[axis]);
    const medianIdx = Math.floor(sortedX.length / 2);
    const medianPoint = sortedX[medianIdx];

    const node: KDNode = {
      point: medianPoint,
      left: this.buildTree(sortedX.slice(0, medianIdx), depth + 1),
      right: this.buildTree(sortedX.slice(medianIdx + 1), depth + 1),
    };

    return node;
  }

  /**
   * Queries the KDTree to find the k nearest neighbors to the given point.
   * @param x The query point, represented as an array of numbers.
   * @param k The number of nearest neighbors to find.
   * @returns An array of the k nearest neighbors to the query point.
   */
  query(x: number[], k: number): number[][] {
    const nearestPoints: number[][] = [];

    const search = (node: KDNode | null): void => {
      if (node === null) {
        return;
      }

      nearestPoints.push(node.point);

      const axis = nearestPoints.length % this.k;
      const axisDiff = x[axis] - node.point[axis];
      const dist = this.distance(x, node.point);

      const closerNode = axisDiff < 0 ? node.left : node.right;
      const furtherNode = axisDiff < 0 ? node.right : node.left;

      search(closerNode);

      // If we haven't found k nearest neighbors or the current node is closer than the furthest neighbor,
      // continue searching in the further node.
      if (nearestPoints.length < k || dist < this.distance(x, nearestPoints[0])) {
        search(furtherNode);
      }

      // If we have found more than k nearest neighbors, keep only the k nearest ones.
      if (nearestPoints.length > k) {
        nearestPoints.sort((a, b) => this.distance(x, a) - this.distance(x, b));
        nearestPoints.length = k;
      }
    };

    search(this.root);

    return nearestPoints;
  }

  /**
   * Computes the Euclidean distance between two points.
   * @param a The first point, represented as an array of numbers.
   * @param b The second point, represented as an array of numbers.
   * @returns The Euclidean distance between the two points.
   */
  private distance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < this.k; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }
}

/**
 * Represents a node in the KDTree.
 */
interface KDNode {
  point: number[]; // The point associated with the node
  left: KDNode | null; // The left child node
  right: KDNode | null; // The right child node
}
