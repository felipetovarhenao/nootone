import ReactGA from "react-ga";

type EventCategory = "UI";
type EventAction = "click";
type EventLabel =
  | "start_app_button"
  | "start_recording_button"
  | "stop_recording_button"
  | "develop_sketch_button"
  | "generate_accompaniment_button"
  | "keep_variation_button";

const useAnalyticsEventTracker = (category: EventCategory) => {
  const eventTracker = (action: EventAction, label: EventLabel) => {
    ReactGA.event({ category, action, label });
  };
  return eventTracker;
};
export default useAnalyticsEventTracker;
