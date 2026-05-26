import {
  DEFAULT_AVATAR_SRC,
  GENDER_AVATAR_SRC_MAP,
  type AvatarGender,
} from "./avatar.constants";

type ResolveAvatarSrcInput = {
  avatarUrl?: string | null;
  gender?: AvatarGender | null;
};

function sanitizeAvatarUrl(value?: string | null) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return undefined;
  }

  return trimmedValue;
}

export function getAvatarSrcByGender(gender?: AvatarGender | null) {
  if (!gender) {
    return DEFAULT_AVATAR_SRC;
  }

  return GENDER_AVATAR_SRC_MAP[gender] ?? DEFAULT_AVATAR_SRC;
}

export function resolveAvatarSrc({ avatarUrl, gender }: ResolveAvatarSrcInput) {
  return sanitizeAvatarUrl(avatarUrl) ?? getAvatarSrcByGender(gender);
}
