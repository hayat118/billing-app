import React from 'react';

interface TableColumn<T> {
  key: string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: string;
  className?: string;
  onRowClick?: (record: T) => void;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  rowKey = 'id',
  className = '',
  onRowClick
}: TableProps<T>) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record, index) => (
            <tr 
              key={record[rowKey] || index} 
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={() => onRowClick && onRowClick(record)}
            >
              {columns.map((column) => (
                <td 
                  key={column.key} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {column.render 
                    ? column.render(record[column.key], record) 
                    : record[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;