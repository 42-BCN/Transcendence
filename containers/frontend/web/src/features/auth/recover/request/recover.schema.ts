import { RecoverReqSchema, type RecoverReq } from '@/contracts/api/auth/auth.validation';
import { createEmptyValues } from '@/hooks/use-form/defaults';

export const fieldsBase = {
  identifier: {
    name: 'identifier',
    labelKey: 'features.auth.fields.identifier.label',
    placeholderKey: 'features.auth.fields.identifier.placeholder',
    isRequired: true,
  },
} as const;

const fieldNames: (keyof typeof fieldsBase)[] = ['identifier'];
const defaultValues = createEmptyValues<RecoverReq>(fieldNames);

export const formApiReq = {
  schema: RecoverReqSchema,
  fieldNames,
  defaultValues,
} as const;
