import styled from 'styled-components';

export const TaskStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  margin-top:-15px;
  padding: 10px;
  background-color: ${(props) => props.color || '#FFFFFF'};
  border-radius: 5px;
  width: auto;
  min-width: auto;
  margin-left: -5px;
  margin-right:-5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
`;

export const TaskStatusHeader = styled.h3`
  margin-bottom: 10px;
  margin-top:-10px;
  color:white;
`;
