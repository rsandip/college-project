import * as yup from 'yup';

const username = yup
  .string()
  .required('Username is required')
  .min(5, 'Should be at least 5 character')
  .max(20, 'should be maximum of 20 character');

const firstName = yup
  .string()
  .required('firstname  is required')
  .min(3, 'Should be at least 3 character');

const lastName = yup
  .string()
  .required('lastname is required')
  .min(3, 'Should be at least 3 character');

const email = yup
  .string()
  .email('This is invalid email')
  .required('Email  is required');

const password = yup
  .string()
  .required('Password  is required')
  .min(5, 'Should be at least 5 character')
  .max(10, 'Should be at least 10 character');

export const UserRegistrationRules = yup.object().shape({
  username,
  firstName,
  lastName,
  email,
  password,
});

export const UserAuthenticationRules = yup.object().shape({
  username,
  password,
});
