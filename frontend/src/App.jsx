import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './actions/store';
import Header from './components/Header';
import Llamas from './components/Llamas';
import LlamaForm from './components/LlamaForm';
import Llama from './components/Llama';
import NotFound from './components/NotFound';
import { fetchAll } from './actions/llama';

function App() {
  useEffect(() => {
    store.dispatch(fetchAll());
  }, []);

  return (
    <Provider store={store}>
      <div className='ledger-page'>
        <Header />
        <main>
          <Routes>
            <Route path='/llamas/:id' element={<Llama />} />
            <Route path='/llamas' element={<Llamas />} />
            <Route path='/llamaForm' element={<LlamaForm />} />
            <Route path='/not-found' element={<NotFound />} />
            <Route path='/' element={<Navigate to='/llamas' replace />} />
            <Route path='*' element={<Navigate to='/not-found' replace />} />
          </Routes>
        </main>
      </div>
    </Provider>
  );
}

export default App;
