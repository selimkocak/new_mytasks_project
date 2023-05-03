import styled from 'styled-components';

export const TaskListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px; // 20px üst boşluk ekleyin
  width: 60%;
  min-width: 500px;
  
`;

export const TaskListHeader = styled.h2`
  text-align: center;
`;

export const TaskListColumn = styled.div`
  background-color: ${({ color }) => color};
  margin: 10px;
  padding: 10px;
  width: 100%; // Genişliği yüzde 100'e ayarlayın
  min-height: 300px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 500px;
`;

export const TaskColumn = styled.div`
  flex: 1;
  margin-right: 1rem;
  margin-left:0;
  padding: 1rem;
  background-color: #f1f1f1;
  border-radius: 5px;
  height: calc(110vh - 200px);
  overflow-y: auto;
  max-width: 350px; // Genişliği 350px olarak sınırlar
  width: 100%;
  min-width: 400px;
  &:last-child {
    margin-right: 0;
  }
`;


export const TaskListTitle = styled.h3`
  margin-top: 0;
  padding: 10px 0;
`;

export const TaskListEmpty = styled.p`
  font-style: italic;
`;

export const TaskListItem = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: #000;
  margin-bottom: 10px;
  padding: 10px;
  
`;

export const TaskListItemTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 1px;
`;

export const TaskListItemDescription = styled.p`
  margin-top: 0;
  margin-bottom: 0;
`;



