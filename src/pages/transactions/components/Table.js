import { useEffect, useMemo, useState } from 'react';
import { formatCurrency, getFormattedName } from '../../../utils/helper';
import { Link } from 'react-router-dom';
import { columnTypes } from '../../../utils/constants';



export const Table = ({ data }) => {
  const [currentPageData, setCurrentPageData] = useState([]);
  const [tableMeta, setTableMeta] = useState({
    search: '',
    perPage: 5,
    sort: {
      column: '',
      type: '', // string | number | date
      order: ''
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const { search, sort: { column, type, order } } = tableMeta;
    let searched = [...data];
    if (search) {
      searched = searched.filter(row => Object.values(row).some(cellValue => cellValue.includes(search)));
    }

    if (column) {
      switch (type) {
        case 'date':
          switch (order) {
            case 'ASC':
              searched = searched.sort((a, b) => (new Date(a[column]).getTime()) > (new Date(b[column]).getTime()) ? 1 : -1);
              break;
            case 'DESC':
              searched = searched.sort((a, b) => (new Date(a[column]).getTime()) < (new Date(b[column]).getTime()) ? 1 : -1);
              break;
            default:
          }
          break;
        case 'number':
        case 'currency':
          switch (order) {
            case 'ASC':
              searched = searched.sort((a, b) => +a[column] > +b[column] ? 1 : -1);
              break;
            case 'DESC':
              searched = searched.sort((a, b) => +a[column] < +b[column] ? 1 : -1);
              break;
            default:
          }
          break;
        default:
          switch (order) {
            case 'ASC':
              searched = searched.sort((a, b) => a[column] > b[column] ? 1 : -1);
              break;
            case 'DESC':
              searched = searched.sort((a, b) => a[column] < b[column] ? 1 : -1);
              break;
            default:
          }
      }
    }
    setFilteredData(searched);
    onPageChange(1, searched);
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [tableMeta]);

  const onPageChange = (newPage, freshFilteredData) => {
    const filtered = freshFilteredData ? freshFilteredData : [...filteredData];
    const start = (newPage - 1) * tableMeta.perPage;
    const end = newPage * tableMeta.perPage;
    setCurrentPage(newPage);
    setCurrentPageData(filtered.slice(start, end))
  }

  const onSort = (column, type) => {
    const tempTableMeta = { ...tableMeta };
    const sortObj = tempTableMeta.sort;
    if (column === tempTableMeta.sort.column) {
      switch (tempTableMeta.sort.order) {
        case "":
          sortObj.column = column;
          sortObj.type = type;
          sortObj.order = 'ASC';
          break;
        case "ASC":
          sortObj.order = 'DESC';
          break;
        default:
          sortObj.column = '';
          sortObj.order = '';
      }
    } else {
      sortObj.column = column;
      sortObj.type = type;
      sortObj.order = 'ASC';
    }
    setTableMeta(tempTableMeta);
  }


  const totalPages = useMemo(() => {
    return Math.ceil(data.length / tableMeta.perPage)
    // eslint-disable-next-line
  }, [tableMeta.perPage]);

  return <>
    {data.length > 0 ?
      <>
        <table className='records'>
          <thead>
            {Object.keys(columnTypes).map(column =>
              <th key={column} onClick={() => onSort(column, columnTypes[column])}>
                <div className='column'>
                  <span>
                    {getFormattedName(column)}
                  </span>
                  {tableMeta.sort.column === column && <img className={`${tableMeta.sort.order === 'ASC' && 'flipped'}`} src='/icons/sort.png' width={20} alt='sort-icon' />}
                </div>
              </th>
            )}
            <th>Action</th>
          </thead>
          <tbody>
            {currentPageData.map(row => <tr>
              <td>{row['id']}</td>
              <td>{row['date']}</td>
              <td>{row['month_year']}</td>
              <td>{row['type']}</td>
              <td>{row['from_account']}</td>
              <td>{row['to_account']}</td>
              <td>{formatCurrency(row['amount'])}</td>
              <td><img src={row['receipt']} alt='receipt' /></td>
              <td>{row['notes']}</td>
              <td>
                <div>
                  <Link to={`${row.id}`}>View</Link>
                </div>
                <div>
                  <Link to={`edit/${row.id}`}>Edit</Link>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
        <div class="pagination-wrapper flex text-center justify-between">
          <div className='per-page flex'>
            <label>Per page</label>
            <select className='mt-0' onChange={(e) => setTableMeta(old => ({ ...old, perPage: e.target.value }))} defaultValue={tableMeta.perPage}>
              {[2, 5, 10, 15, 20].map((perPageCount) => <option key={perPageCount}>{perPageCount}</option>)}
            </select>
          </div>
          <div class="pagination">
            {Array(totalPages)
              .fill()
              .map((item, index) =>
                <span className={`${index + 1 === currentPage ? 'active' : ''}`} onClick={() => onPageChange(index + 1)}>{index + 1}</span>
              )
            }
          </div>
        </div>
      </> : <div className='flex justify-center'><h4>No Data Found</h4></div>
    }
  </>;
}