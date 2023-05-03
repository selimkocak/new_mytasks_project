// frontend\src\components\Views\TaskItemStyle.js
import styled from 'styled-components';

export const TaskItemContainer = styled.div`
  display: grid;
  grid-template-rows: auto 5fr auto 1fr; // Bu satırı düzenleyin
  position: relative;
  padding: 0.3rem;
  margin-bottom: 1rem;
  margin-top:-10px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: auto;
  height: 100%; // Bu satırı ekleyin
`;


export const ViewIconContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-self: start; // Bu satırı ekleyin
  align-self: end; // Bu satırı ekleyin
  width: 100%; // Bu satırı ekleyin
  margin-left:auto;
  margin-left:auto;
`;


export const TaskTitle = styled.h3`
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
`;

export const TaskDescription = styled.p`
  margin: 0;
`;