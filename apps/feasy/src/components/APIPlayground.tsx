import { type ComponentPropsWithoutRef } from "react";

export type APIPlaygroundProps = {
  //
} & ComponentPropsWithoutRef<"div">;
export function APIPlayground({ ...props }: APIPlaygroundProps) {
  return (
    <div {...props}>
      <h1>APIPlayground</h1>
    </div>
  );
}
