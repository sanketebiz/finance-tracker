import './App.css';
import './assets/styles/transaction.css';
import './assets/styles/common.css';

import { createBrowserRouter, RouterProvider, Route, Navigate, createRoutesFromElements, Routes } from 'react-router-dom';
import { Transactions } from './pages/transactions/Transactions';
import { TransactionForm } from './pages/transactions/TransactionForm';
import { TransactionDetails } from './pages/transactions/TransactionDetails';

// const token = '3r3fe4rfe4rffrexed4fed4xxge4dg';
const token = 'test-token';

const FinalRoute = props => {
  const { isPublic, cmp } = props;
  if (isPublic) {
    if (!token) {
      return cmp;
    } else {
      return <Navigate to="/transactions" />
    }
  } else {
    if (token) {
      return cmp;
    } else {
      return <Navigate to="/login" />

    }
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='login' element={<FinalRoute isPublic cmp={<span>login page</span>} />} />
      <Route path='transactions'>
        <Route path='' element={<FinalRoute cmp={<Transactions />} />} />
        <Route path=':id' element={<FinalRoute cmp={<TransactionDetails />} />} />
        <Route path='create' element={<FinalRoute cmp={<TransactionForm />} />} />
        <Route path='edit/:id' element={<FinalRoute cmp={<TransactionForm />} />} />
      </Route>
      <Route path='' element={<Navigate to={'/transactions'} />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
