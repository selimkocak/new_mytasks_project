// frontend\src\components\Tasks\Filter\TaskFilter.js kodlarım
import React, { useState } from 'react';

const TaskFilter = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setSelectedFilter(filterValue);
    onFilterChange(filterValue);
  };

  return (
    <select value={selectedFilter} onChange={handleFilterChange}>
      <option value="all">Tümü</option>
      <option value="today">Bugün</option>
      <option value="thisWeek">Bu Hafta</option>
      <option value="nextWeek">Gelecek Hafta</option>
      <option value="thisMonth">Bu Ay</option>
      <option value="nextMonth">Gelecek Ay</option>
    </select>
  );
};
export default TaskFilter;