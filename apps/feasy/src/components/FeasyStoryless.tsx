import { Combinations, Storyless } from "@storyless/react";
import { Toggle } from "./Toggle";

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
              checked: [false, true],
              label: ["World Peace 🕊️"],
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
            }}
          />
        ),
      }}
    />
  );
}
