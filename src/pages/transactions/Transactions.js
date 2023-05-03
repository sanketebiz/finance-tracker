import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll } from './requests/transactionRequests';
import { Table } from './components/Table';
import { groupByOptions } from '../../utils/constants';

export const Transactions = () => {
  const navigate = useNavigate();
  const [originalData] = useState(getAll());
  const [grouped, setGrouped] = useState({});

  const onGroupBy = (groupByColumn) => {
    if (!groupByColumn) {
      setGrouped({});
      return;
    }
    const clonedOriginal = [...originalData];
    const groupedData = clonedOriginal.reduce((acc, cur) => {
      if (!acc[cur[groupByColumn]]) {
        acc[cur[groupByColumn]] = [];
      }
      acc[cur[groupByColumn]].push(cur);
      return acc;
    }, {})
    setGrouped(groupedData);
  }

  return <div className='container'>
    <div className='header'>
      <button onClick={() => navigate('create')}>Create Transaction</button>
      <div className='group-wrapper'>
        <select onChange={e => onGroupBy(e.target.value)}>
          {groupByOptions.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}
        </select>
      </div>
    </div>
    <div className='main'>
      {Object.keys(grouped).length > 0 ?
        Object.keys(grouped).map((groupByColumn) =>
          <div key={groupByColumn}>
            <h3>{groupByColumn}</h3>
            <Table data={grouped[groupByColumn]} />
          </div>
        )
        : <Table data={originalData} />}

    </div>
  </div>;
}
