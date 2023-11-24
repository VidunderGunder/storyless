import { Combinations, Storyless } from "@storyless/react";
import { Toggle } from "./Toggle";
import { APIPlayground } from "./APIPlayground";

export function FeasyStoryless() {
  return (
    <Storyless
      style={{
        zIndex: 1000,
      }}
      components={{
        Toggle: (
          <Combinations
            component={Toggle}
            componentBackgroundColor="#111729"
            propsToCombine={{
              defaultChecked: [false, true],
              label: ["Peace 🕊️"],
              color: [
                "primary",
                "secondary",
                "accent",
                "neutral",
                "info",
                "success",
                "warning",
                "error",
              ],
              toggleId: ["lookin-good"],
              className: ["w-full"],
            }}
          />
        ),
        API: <APIPlayground />,
      }}
    />
  );
}
