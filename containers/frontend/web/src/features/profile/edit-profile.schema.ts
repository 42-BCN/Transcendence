import type { UpdateMeProfileReq } from '@/contracts/api/users/users.validation';
import { UpdateMeProfileReqSchema } from '@/contracts/api/users/users.validation';

export const BIO_MAX_LENGTH = 600;

const fieldNames = ['bio'] as const satisfies readonly (keyof UpdateMeProfileReq)[];

export function createEditProfileForm(initialBio: string) {
  return {
    schema: UpdateMeProfileReqSchema,
    fieldNames,
    defaultValues: {
      bio: initialBio,
    } satisfies UpdateMeProfileReq,
  } as const;
}
