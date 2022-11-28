import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../../pages/ResetPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
const mockedReplaceLocation = jest.fn();

jest.mock('react-router-dom', () => {
    return {
        useHistory: () => ({
            push: mockedHistoryPush,
        }),
        useLocation: () => ({
            search: {
                replace: mockedReplaceLocation,
            },
        }),
        Link: ({ children }: { children: React.ReactNode }) => children,
    };
});

jest.mock('../../services/api', () => {
    return {
        post: jest.fn(),
    };
});

jest.mock('../../hooks/toast', () => {
    return {
        useToast: () => ({
            addToast: mockedAddToast,
        }),
    };
});

describe('Reset Password Page', () => {
    beforeEach(() => {
        mockedHistoryPush.mockClear();
        mockedReplaceLocation.mockImplementation(() => 'user-token');
    });

    it('should be able to reset password', async () => {
        const { getByPlaceholderText, getByText } = render(<ResetPassword />);

        const passwordField = getByPlaceholderText('Nova senha');
        const passwordConfirmationField = getByPlaceholderText(
            'Confirmação da senha',
        );
        const buttonElement = getByText('Alterar senha');

        fireEvent.change(passwordField, {
            target: { value: '123456' },
        });

        fireEvent.change(passwordConfirmationField, {
            target: { value: '123456' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(mockedHistoryPush).toHaveBeenCalledWith('/');
        });
    });

    it('should not be able to reset password with invalid credentials', async () => {
        const { getByPlaceholderText, getByText } = render(<ResetPassword />);

        const passwordField = getByPlaceholderText('Nova senha');
        const passwordConfirmationField = getByPlaceholderText(
            'Confirmação da senha',
        );
        const buttonElement = getByText('Alterar senha');

        fireEvent.change(passwordField, {
            target: { value: '12345' },
        });

        fireEvent.change(passwordConfirmationField, {
            target: { value: '123456' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
        });
    });

    it('should display an error if reset password fails', async () => {
        mockedReplaceLocation.mockImplementation(jest.fn());

        const { getByPlaceholderText, getByText } = render(<ResetPassword />);

        const passwordField = getByPlaceholderText('Nova senha');
        const passwordConfirmationField = getByPlaceholderText(
            'Confirmação da senha',
        );
        const buttonElement = getByText('Alterar senha');

        fireEvent.change(passwordField, {
            target: { value: '123456' },
        });

        fireEvent.change(passwordConfirmationField, {
            target: { value: '123456' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
        });
    });
});
