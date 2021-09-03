import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
  render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
  render(<ContactForm/>);
  const header = screen.getByText(/Contact Form/i);
  expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm/>);
  const firstNameInp = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameInp, 'abcd');
  await waitFor(() => {
    const firstNameErr = screen.queryByText(
      /Error: firstName must have at least 5 characters./i
    )
    expect(firstNameErr).toBeInTheDocument();
  });
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm/>);
  const submit = screen.getByRole(/button/i);
  userEvent.click(submit);
  await waitFor(() => {

    // Works, but could probably simplify.

    // expect(screen.queryByText(
    //   /firstName must have at least 5 characters./i
    // )).toBeInTheDocument()
    // expect(screen.queryByText(
    //   /Error: lastName is a required field./i
    // )).toBeInTheDocument()
    // expect(screen.queryByText(
    //   /Error: email must be a valid email address./i
    // )).toBeInTheDocument()

    const errorMessages = screen.getAllByText(/error/i);
    expect(errorMessages).toHaveLength(3);
  });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm/>);
  const firstName = screen.getByLabelText(/First Name*/i);
  const lastName = screen.getByLabelText(/Last Name*/i);
  const submit = screen.getByRole(/button/i);

  userEvent.type(firstName, 'Billy');
  userEvent.type(lastName, 'Bob');
  userEvent.click(submit);

  await waitFor(() => {
    const errorMessages = screen.getAllByText(/error/i);
    expect(errorMessages).toHaveLength(1);
  });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm/>);
  const emailInput = screen.getByLabelText(/Email*/i);
  userEvent.type(emailInput, 'ahhhh');

  await waitFor(() => {
    const errorMessages = screen.getByText(
      /Error: email must be a valid email address./i
    );
    expect(errorMessages).toBeInTheDocument();
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm/>);
  const submit = screen.getByRole(/button/i);
  userEvent.click(submit);
  await waitFor(() => {
    const error = screen.getByText(/lastName is a required field/i);
    expect(error).toBeInTheDocument();
  })
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm/>);
  const firstName = screen.getByLabelText(/First Name*/i);
  const lastName = screen.getByLabelText(/Last Name*/i);
  const emailInput = screen.getByLabelText(/Email*/i);
  const submit = screen.getByRole(/button/i);

  userEvent.type(firstName, 'Thomas');
  userEvent.type(lastName, 'Moore');
  userEvent.type(emailInput, 'foo@foo.com');
  userEvent.click(submit);

  const submittedFirstName = screen.getByTestId(/firstnameDisplay/);
  const submittedLastName = screen.getByTestId(/lastnameDisplay/);
  const submittedEmail = screen.getByTestId(/emailDisplay/);
  const submittedMessage = screen.queryByTestId(/messageDisplay/);

  expect(submittedFirstName).toHaveTextContent(/Thomas/);
  expect(submittedLastName).toHaveTextContent(/Moore/);
  expect(submittedEmail).toHaveTextContent(/foo@foo.com/);
  expect(submittedMessage).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm/>);
  const firstName = screen.getByLabelText(/First Name*/i);
  const lastName = screen.getByLabelText(/Last Name*/i);
  const emailInput = screen.getByLabelText(/Email*/i);
  const message = screen.getByLabelText(/Message/i);
  const submit = screen.getByRole(/button/i);

  userEvent.type(firstName, 'Thomas');
  userEvent.type(lastName, 'Moore');
  userEvent.type(emailInput, 'foo@foo.com');
  userEvent.type(message, 'AHHHHHHHHHHHHHHHH');
  userEvent.click(submit);

  const submittedFirstName = screen.getByTestId(/firstnameDisplay/);
  const submittedLastName = screen.getByTestId(/lastnameDisplay/);
  const submittedEmail = screen.getByTestId(/emailDisplay/);
  const submittedMessage = screen.queryByTestId(/messageDisplay/);

  expect(submittedFirstName).toHaveTextContent(/Thomas/);
  expect(submittedLastName).toHaveTextContent(/Moore/);
  expect(submittedEmail).toHaveTextContent(/foo@foo.com/);
  expect(submittedMessage).toHaveTextContent(/AHHHHHHHHHHHHHHHH/);
    
});