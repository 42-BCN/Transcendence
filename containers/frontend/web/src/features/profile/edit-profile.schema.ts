import type { UpdateMeProfileReq } from '@/contracts/api/users/users.validation';
import { UpdateMeProfileReqSchema } from '@/contracts/api/users/users.validation';

export const BIO_MAX_LENGTH = 600;

const fieldNames = ['bio', 'avatar'] as const satisfies readonly (keyof UpdateMeProfileReq)[];

export function createEditProfileForm(initialBio: string, initialAvatar: string | null) {
  return {
    schema: UpdateMeProfileReqSchema,
    fieldNames,
    defaultValues: {
      bio: initialBio,
      avatar: initialAvatar,
    } satisfies UpdateMeProfileReq,
  } as const;
}
