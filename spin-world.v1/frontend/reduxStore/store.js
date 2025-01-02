import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/AuthSlice";
import investmentReducer from "./slices/InvestmentsSlice";
import referralReducer from "./slices/ReferralsSlice";
import walletReducer from "./slices/WalletSlice";
import referralCodeReducer from "./slices/ReferralCodeSlice";
import userReducer from "./slices/UserSlice";
import countryReducer from "./slices/CountrySlice";
import paymentTypeReducer from "./slices/PaymentTypeSlice";
import changePasswordReducer from "./slices/UpdatePasswordSlice";
import transactionsReducer from "./slices/transactionsSlice";
import paymentMethodsReducer from "./slices/PaymentMethodSlice";
import promoCodesReducer from "./slices/PromoCodesSlice";
import spinnerReducer from "./slices/SpinnerSlice";
import promoCodeRedeemReducer from "./slices/PromoCodeRedeemSlice";
import rankingReducer from "./slices/RankingSlice";
import paymentReducer from "./slices/PaymentOrderSlice";
import UserInvestmentSReducer from "./slices/UserInvestmentSlice";
import currencyReducer from "./slices/CurrencyRates";
import withdrawalRequestReducer from "./slices/WithdrawalRequestSlice";
import WithdrawalReducer from "./slices/WithdrawalSlice";
import withdrawalTermsReducer from "./slices/WithdrawalTermsSlice";
import statsReducer from "./slices/StatsSlice";
import reviewsReducer from "./slices/reviewSlice";
import referralListReducer from "./slices/ReferralListSlice";

// Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  investments: investmentReducer,
  userInvestments: UserInvestmentSReducer,
  referral: referralReducer,
  referralList: referralListReducer,
  wallet: walletReducer,
  referralCode: referralCodeReducer,
  user: userReducer,
  countries: countryReducer,
  paymentTypes: paymentTypeReducer,
  changePassword: changePasswordReducer,
  transactions: transactionsReducer,
  paymentMethods: paymentMethodsReducer,
  promoCodes: promoCodesReducer,
  spinner: spinnerReducer,
  promoCodeRedeem: promoCodeRedeemReducer,
  ranking: rankingReducer,
  payment: paymentReducer,
  currency: currencyReducer,
  withdrawalRequest: withdrawalRequestReducer,
  withdrawal: WithdrawalReducer,
  withdrawalTerms: withdrawalTermsReducer,
  stats: statsReducer,
  reviews: reviewsReducer,
});

// Configure the store without persistence
const store = configureStore({
  reducer: rootReducer,
});

export { store };
