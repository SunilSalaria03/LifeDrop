import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AvatarGender } from "@/lib/avatar/avatar.constants";
import { resolveAvatarSrc } from "@/lib/avatar/avatar.utils";

type GenderAvatarProps = {
  alt: string;
  avatarUrl?: string | null;
  className?: string;
  fallback: string;
  fallbackClassName?: string;
  gender?: AvatarGender | null;
  imageClassName?: string;
};

export function GenderAvatar({
  alt,
  avatarUrl,
  className,
  fallback,
  fallbackClassName,
  gender,
  imageClassName,
}: GenderAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage
        alt={alt}
        className={imageClassName}
        src={resolveAvatarSrc({ avatarUrl, gender })}
      />
      <AvatarFallback className={fallbackClassName}>{fallback}</AvatarFallback>
    </Avatar>
  );
}
