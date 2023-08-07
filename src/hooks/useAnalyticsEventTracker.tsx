import ReactGA from "react-ga4";
import { UaEventOptions } from "react-ga4/types/ga4";

export enum EventAction {
  CLICK = "click",
}
export enum EventCategory {
  UI = "UI",
}
export enum EventName {
  START_APP = "start_app",
  START_RECORDING = "start_recording",
  STOP_RECORDING = "stop_recording",
  DEVELOP_SKETCH = "develop_sketch",
  GENERATE_ACCOMPANIMENT = "generate_accompaniment",
  KEEP_VARIATION = "keep_variation",
  BETA_LOGIN = "beta_login",
  EMAIL_FORM_SUBMISSION = "email_form_submission",
  FEEDBACK_FORM_SUBMISSION = "feedback_form_submission",
}
const useAnalyticsEventTracker = () => {
  const eventTracker = (name: EventName, options?: UaEventOptions) => {
    ReactGA.event(name, {
      action: EventAction.CLICK,
      category: EventCategory.UI,
      ...options,
    });
  };
  return eventTracker;
};
export default useAnalyticsEventTracker;
