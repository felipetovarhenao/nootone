import euclideanDistance from "./euclideanDistance";

export default class KDTree {
  private dims: number;
  private min: number[];
  private max: number[];
  private leafSize: number;
  private root: KDTreeNode;

  constructor(points: number[][], leafSize: number = 15) {
    this.dims = points[0].length;
    this.min = [...Array(this.dims).fill(Infinity)];
    this.max = [...Array(this.dims).fill(-Infinity)];
    this.leafSize = leafSize;
    this.root = this.build(this.preprocess(points), 0);
  }

  private preprocess(points: number[][]): KDTreePoint[] {
    const data: KDTreePoint[] = [];

    // find normalization values
    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      // ensure all points have the same dimensionality
      if (point.length !== this.dims) {
        throw new Error("All points must have the same dimensionality");
      }

      for (let j = 0; j < this.dims; j++) {
        this.min[j] = Math.min(this.min[j], point[j]);
        this.max[j] = Math.max(this.max[j], point[j]);
      }
    }

    // precompute range (difference between min and max)
    const range = this.getMinMaxRange();

    // apply normalization values
    for (let i = 0; i < points.length; i++) {
      data.push({
        id: i,
        value: points[i].map((x, n) => (x - this.min[n]) / range[n]),
      });
    }

    return data;
  }

  private getMinMaxRange(): number[] {
    return this.max.map((x, i) => x - this.min[i]);
  }

  private build(points: KDTreePoint[], depth: number): KDTreeNode | KDTreePoint[] {
    if (points.length <= this.leafSize) {
      return points;
    }

    const axis = depth % this.dims;

    // sort points across current axis
    points.sort((a, b) => a.value[axis] - b.value[axis]);

    const medianIndex = Math.floor(points.length / 2);
    const medianPoint = points[medianIndex];
    const node: KDTreeNode = {
      axis: {
        dim: axis,
        value: medianPoint.value[axis],
      },
      left: [],
      right: [],
    };

    node.left = this.build(points.slice(0, medianIndex), depth + 1);
    node.right = this.build(points.slice(medianIndex), depth + 1);

    return node;
  }

  public knn(point: number[], k?: number): KDTreePoint[] {
    if (point.length !== this.dims) {
      throw new Error("Input point does not match the tree's dimentionality");
    }

    let current: KDTreeNode = this.root;

    const range = this.getMinMaxRange();

    const normalizedPoint = point.map((x, i) => (x - this.min[i]) / range[i]);

    // find closest leaf
    while (true) {
      if ("axis" in current) {
        current = normalizedPoint[current.axis.dim] < current.axis.value ? current.left : current.right;
      } else {
        break;
      }
    }

    const neighbors: KDTreeNeighbor[] = [];

    for (let i = 0; i < current.length; i++) {
      neighbors.push({
        point: current[i],
        distance: this.getDistance(current[i].value, normalizedPoint),
      });
    }

    neighbors.sort((a, b) => a.distance - b.distance);

    const postprocessNeighbor = (x: KDTreeNeighbor): KDTreePoint => ({
      id: x.point.id,
      value: x.point.value.map((val, i) => val * range[i] + this.min[i]),
    });

    return (k !== undefined ? neighbors.slice(0, k) : neighbors).map(postprocessNeighbor);
  }

  private getDistance(x: number[], y: number[]) {
    return euclideanDistance(x, y);
  }
}

type KDTreePoint = {
  id: number;
  value: number[];
};

type KDTreeNeighbor = {
  point: KDTreePoint;
  distance: number;
};

type KDTreeNode =
  | KDTreePoint[]
  | {
      axis: {
        dim: number;
        value: number;
      };
      left: KDTreeNode;
      right: KDTreeNode;
    };
