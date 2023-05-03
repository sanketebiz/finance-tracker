import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from './requests/transactionRequests';
import { columnTypes } from '../../utils/constants';
import { formatCurrency, getFormattedName } from '../../utils/helper';

export const TransactionDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [details, setDetails] = useState({});
  const [isFound, setIsFound] = useState();

  useEffect(() => {
    if (params.id) {
      const singleTransaction = getById(params.id);
      if (singleTransaction) {
        setIsFound(true);
        setDetails(singleTransaction);
      } else {
        setIsFound(false);
      }
    }
  }, [params]);

  const renderColumnValue = (column, columnType) => {
    switch (columnType) {
      case "currency":
        return <span>{formatCurrency(details[column])}</span>
      case "file":
        return <div className='media-preview'><img src={details[column]} alt='receipt' /></div>
      default:
        return <span>{details[column]}</span>
    }
  }

  return <div className='container'>
    <div className='transction-form-wrapper'>
      <div className='transction-form'>
        <span className='back-link' onClick={() => navigate('/transactions')}>{'< Back To Transactions'}</span>
        <h2>Transaction Details</h2>
        {isFound === false
          ? <div>Transaction Not Found!</div>
          : <div>
            {Object.keys(columnTypes).map(column => <div>
              <h4>{getFormattedName(column)}</h4>
              {renderColumnValue(column, columnTypes[column])}
            </div>)}
          </div>
        }
      </div>
    </div>
  </div>;
}