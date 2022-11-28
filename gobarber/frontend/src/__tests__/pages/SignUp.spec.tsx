import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../../pages/SignUp';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
    return {
        useHistory: () => ({
            push: mockedHistoryPush,
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

describe('SignUp Page', () => {
    beforeEach(() => {
        mockedHistoryPush.mockClear();
    });

    it('should be able to sign up', async () => {
        const { getByPlaceholderText, getByText } = render(<SignUp />);

        const nameField = getByPlaceholderText('Name');
        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Password');
        const buttonElement = getByText('Cadastrar');

        fireEvent.change(nameField, {
            target: { value: 'John Doe' },
        });

        fireEvent.change(emailField, {
            target: { value: 'johndoes@example.com' },
        });

        fireEvent.change(passwordField, {
            target: { value: '123456' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(mockedHistoryPush).toHaveBeenCalledWith('/');
        });
    });

    it('should not be able to sign up with invalid credentials', async () => {
        const { getByPlaceholderText, getByText } = render(<SignUp />);

        const nameField = getByPlaceholderText('Name');
        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Password');
        const buttonElement = getByText('Cadastrar');

        fireEvent.change(nameField, {
            target: { value: 'John Doe' },
        });

        fireEvent.change(emailField, {
            target: { value: 'non-value-email' },
        });

        fireEvent.change(passwordField, {
            target: { value: '123456' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
        });
    });

    it('should display an error if sign up fails', async () => {
        mockedHistoryPush.mockImplementation(() => {
            throw new Error();
        });

        const { getByPlaceholderText, getByText } = render(<SignUp />);

        const nameField = getByPlaceholderText('Name');
        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Password');
        const buttonElement = getByText('Cadastrar');

        fireEvent.change(nameField, {
            target: { value: 'John Doe' },
        });

        fireEvent.change(emailField, {
            target: { value: 'johndoes@example.com' },
        });

        fireEvent.change(passwordField, {
            target: { value: '123456' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(mockedAddToast).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'error' }),
            );
        });
    });
});
