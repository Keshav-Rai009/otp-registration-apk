// App.js
import React from "react";
import { UserProvider } from "./context/UserContext";
import AppNavigator from "./components/AppNavigator";

function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}

export default App;
