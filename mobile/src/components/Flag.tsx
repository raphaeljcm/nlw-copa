import { IImageProps, Image } from "native-base";

export function Flag({ ...rest }: IImageProps) {
  return (
    <Image
      alt="Bandeira"
      w={8}
      h={6}
      mx={3}
      {...rest}
    />
  );
}
