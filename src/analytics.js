import ReactGA from "react-ga4";

const TRACKING_ID = "G-JDXFYYEBHX"; // Replace with your GA4 ID
ReactGA.initialize(TRACKING_ID);

export const trackPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
