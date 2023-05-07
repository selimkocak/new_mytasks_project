// frontend\src\components\Tasks\Date\TaskDate.js
import React from "react";
import { TextField } from "@mui/material";
import { format, parse } from "date-fns";

const formatDate = (date) => {
  return format(date, "dd.MM.yyyy");
};

const parseDate = (dateStr) => {
  return parse(dateStr, "dd.MM.yyyy", new Date());
};

const TaskDate = ({ handleDateChange, initialDate }) => {
  const formattedDate = initialDate ? formatDate(initialDate) : "";
  const handleFormattedDateChange = (e) => {
    const parsedDate = parseDate(e.target.value);
    handleDateChange(parsedDate);
  };

  return (
    <TextField
      label="Deadline"
      type="text"
      value={formattedDate}
      onChange={handleFormattedDateChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};
export default TaskDate;