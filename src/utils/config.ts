export enum DeploymentType {
  PROD,
  PRE,
  DEV,
}

const CONFIG = {
  deploymentType: (() => {
    const origin = window.origin;
    if (origin.includes("nootone.io")) {
      return DeploymentType.PROD;
    } else if (origin.includes("cloudfront")) {
      return DeploymentType.PRE;
    } else {
      return DeploymentType.DEV;
    }
  })(),
};

export default CONFIG;
