import * as yup from 'yup';

const title = yup
  .string()
  .required('title  is required')
  .min(5, 'Should be at least 5 character');

const content = yup
  .string()
  .required('content is required')
  .min(10, 'Should be at least 10 character')
  .max(250, 'could be upto 250 characters');

export const NewPostValidationRules = yup.object({
  title,
  content,
});
