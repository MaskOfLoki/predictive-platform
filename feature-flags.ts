// This is not a maintainable way to do this, but we have nothing
// set up to handle this right now. We will on BE 2.0, though.

export enum FeatureFlag {
  SMSBulkNotification,
  HomePage,
}

export const FeatureFlags = {
  SMSBulkNotification: true,
  HomePage: true,
};
