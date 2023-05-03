// frontend/src/components/Views/TaskDeleteStyle.js
import styled from 'styled-components';

export const DeleteButton = styled.button.attrs({
  className: 'btn btn-danger',
})`
  margin-left: 1rem;
`;

const TaskDeleteStyle = {
  DeleteButton,
};

export default TaskDeleteStyle;
