import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.8);
    align-items: center;
    justify-content: center;
`;

export const LoadingStatus = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: 16px;
    text-align: center;

    margin-bottom: 15px;
`;