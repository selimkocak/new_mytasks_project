// frontend\src\utils\validation.js

export const validateTaskForm = (values) => {
    const errors = {};
  
    if (!values.title || values.title.trim() === '') {
      errors.title = 'Title is required';
    }
  
    if (!values.description || values.description.trim() === '') {
      errors.description = 'Description is required';
    }
  
    if (!values.status) {
      errors.status = 'Status is required';
    }
  
    if (!values.deadline) {
      errors.deadline = 'Deadline is required';
    }
  
    return errors;
  };
  