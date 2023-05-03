import './App.css';
import './assets/styles/transaction.css';
import './assets/styles/common.css';

import { createBrowserRouter, RouterProvider, Route, Navigate, createRoutesFromElements } from 'react-router-dom';
import { Transactions } from './pages/transactions/Transactions';
import { TransactionForm } from './pages/transactions/TransactionForm';
import { TransactionDetails } from './pages/transactions/TransactionDetails';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='transactions'>
        <Route path='' element={<Transactions />} />
        <Route path=':id' element={<TransactionDetails />} />
        <Route path='create' element={<TransactionForm />} />
        <Route path='edit/:id' element={<TransactionForm />} />
      </Route>
      <Route path='' element={<Navigate to={'/transactions'} />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
