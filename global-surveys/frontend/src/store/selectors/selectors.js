import { createSelector } from "reselect";

// Simple input selector
const selectUserInfo = (state) => state.user.userInfo;

// Memoized selector
export const selectMemoizedUserInfo = createSelector(
  [selectUserInfo],
  (userInfo) => userInfo
);
