import { Provider } from "react-redux";

import { init } from "./db";
import AppNavigator from "./navigation/index";
import { store } from "./store";

init()
  .then(() => {
    console.log("Initialized db");
  })
  .catch((err) => {
    console.log("Initialized db fail");
    console.log(err);
  });

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
