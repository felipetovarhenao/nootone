import ReactGA from "react-ga4";
import { UaEventOptions } from "react-ga4/types/ga4";

export enum EventAction {
  CLICK,
}
export enum EventCategory {
  UI,
}
export enum EventName {
  START_APP,
  START_RECORDING,
  STOP_RECORDING,
  DEVELOP_SKETCH,
  GENERATE_ACCOMPANIMENT,
  KEEP_VARIATION,
}
const useAnalyticsEventTracker = () => {
  const eventTracker = (name: EventName, options?: UaEventOptions) => {
    ReactGA.event(String(name).toLowerCase(), {
      action: String(EventAction.CLICK).toLowerCase(),
      category: String(EventCategory.UI).toLowerCase(),
      ...options,
    });
  };
  return eventTracker;
};
export default useAnalyticsEventTracker;
