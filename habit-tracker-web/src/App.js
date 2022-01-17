import './App.css';
import RouterNav from './RouterNav';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux"

function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterNav />
      </PersistGate>
    </Provider>
  );
}

export default App;