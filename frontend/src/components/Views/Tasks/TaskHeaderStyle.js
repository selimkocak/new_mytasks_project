// frontend\src\components\Views\TaskHeaderStyle.js
import styled from 'styled-components';

export const TaskHeaderContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f5f5f5;
`;


export const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #333;
  background-color: #fff;

  &:focus {
    border-color: #999;
  }
`;

export const SubmitButton = styled.button`
  background-color: #3f497f;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #2c3663;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  // İstediğiniz stil özelliklerini buraya ekleyin
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #00bcd4;
  color: white;
  border: none;
  border-radius: 4px;
`;



