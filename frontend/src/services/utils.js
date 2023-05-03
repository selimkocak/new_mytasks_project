const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isThisWeek = (date) => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
  
    return date >= weekStart && date <= weekEnd;
  };
  
  const isThisMonth = (date) => {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  export const filterTasks = (tasks, filterValue) => {
    switch (filterValue) {
      case 'all':
        return tasks;
      case 'today':
        return tasks.filter((task) =>
          isToday(new Date(task.deadline))
        );
      case 'thisWeek':
        return tasks.filter((task) =>
          isThisWeek(new Date(task.deadline))
        );
      case 'thisMonth':
        return tasks.filter((task) =>
          isThisMonth(new Date(task.deadline))
        );
      default:
        return tasks;
    }
  };
  