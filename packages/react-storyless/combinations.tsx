type ComponentType =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is fine for now 🔥🙂🔥
  | React.ComponentType<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is fine for now 🔥🙂🔥
  | React.ForwardRefExoticComponent<any>;
type PropsToCombine<C extends ComponentType> = {
  [K in keyof React.ComponentPropsWithoutRef<C>]?: React.ComponentPropsWithoutRef<C>[K][];
};
type AllCombinationsProps<C extends ComponentType> = {
  /**
   * The component to display.
   *
   * _Note: For polymorphic components, auto-complete will only work if you pass the component type here, e.g.:_
   *
   * ```tsx
   * <AllCombinations component={Component<"span">} propsToCombine={{...}} />
   * ```
   */
  component: C;
  /**
   * The props to display all combinations for.
   *
   * _Note: For polymorphic components, auto-complete will only work if you specify the component type to `component`, e.g.:_
   *
   * ```tsx
   * <AllCombinations component={Component<"span">} propsToCombine={{...}} />
   * ```
   */
  propsToCombine: PropsToCombine<C>;
  /**
   * Props to pass to all instances of the component.
   */
  componentProps?: React.ComponentPropsWithoutRef<C>;
  /**
   * Override the number of columns to display the combinations in.
   *
   * Default: Length of the first prop to combine.
   */
  columns?: number;
  /**
   * Override the background color of the combinations.
   */
  componentBackgroundColor?: string;
} & React.ComponentPropsWithoutRef<"div">;

function truncateValue<V>(value: V, truncateAt = 25): string {
  const stringValue: string | undefined =
    typeof value === "string" ? value : String(value);
  return stringValue.length > truncateAt
    ? `${stringValue.slice(0, truncateAt)}...`
    : stringValue;
}

/**
 * Modulate the number of columns to display the combinations in.
 *
 * If the value is greater than the maximum number of columns (default 5), it will be divided by 2 and rounded up.
 *
 * If the value is greater than the maximum number of columns times two, it will be divided by 3 and rounded up and so on.
 */
export function modulateGridCols(value: number, maxCols = 5): number {
  if (value <= maxCols) {
    return value;
  }
  return modulateGridCols(Math.ceil(value / 2), maxCols);
}

const backgroundColor = "#fdfdfd";
const fontColor = "rgb(19, 24, 30)";

/**
 * Display all combinations of props for a component.
 *
 * Main props:
 *
 * - `component` - The component to display.
 * - `propsToCombine` - The props to display all combinations for.
 * - `componentProps` - Props to pass to all instances of the component.
 * - `columns` - Override the number of columns to display the combinations in.
 * - `componentBackgroundColor` - Override the background color of the combinations.
 * 
 * @example
 *
 * ```tsx
 * <AllCombinations
 *   component={Button} // props => <Button {...props} />
 *   propsToCombine={{
 *     color: ["slate", "emerald", "sky", "rose"],
 *     size: ["lg", "sm"],
 *     square: [false, true],
 *     disabled: [false, true],
 *     children: ["Button"],
 *   }}
 *   backgroundColor="#13191f"
 *   columns={2} // Auto-calculated by default
 * />
 * ```
 *

 */
export function Combinations<C extends ComponentType>({
  component,
  propsToCombine,
  componentProps,
  columns,
  componentBackgroundColor,
  ...props
}: AllCombinationsProps<C>): JSX.Element | null {
  const combinations = getCombinations(propsToCombine);
  const firstPropKey = Object.keys(propsToCombine)[0] ?? "";
  const firstPropLength: number =
    firstPropKey === "" ? 1 : propsToCombine[firstPropKey]?.length ?? 1;
  let _columns = columns ?? firstPropLength;

  if (columns === undefined) {
    _columns = modulateGridCols(_columns);
  }

  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        placeItems: "center",
        gap: "1rem",
        padding: "1rem 3rem",
        gridTemplateColumns: `repeat(${_columns}, minmax(0, 1fr))`,
        ...props.style,
      }}
      {...props}
    >
      {combinations.map((comboProps, index) => {
        const Component = component;
        const label = Object.entries(comboProps)
          .map(([key, value]) => `${key}: ${truncateValue(value)}`)
          .join("\n");
        const key = [label, index].join("-");

        return (
          <div
            key={key}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              borderRadius: "1rem",
              boxShadow: `
                0px 0px 0px 4px ${backgroundColor}
              `,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "1rem",
                boxShadow: `
                  0px 5px 0px 4px ${backgroundColor}
                `,
                // backdropFilter: "blur(10px)",
                // backgroundColor: "rgba(255, 255, 255, 0.25)",
                backgroundColor: componentBackgroundColor,
                padding: "1.5rem",
                overflow: "hidden",
              }}
            >
              <Component {...comboProps} {...componentProps}>
                {comboProps?.children ?? componentProps?.children ?? null}
              </Component>
            </div>
            {typeof label === "string" && label.length > 0 ? (
              <pre
                style={{
                  width: "100%",
                  backgroundColor,
                  borderRadius: "1rem",
                  borderTopRightRadius: "0",
                  borderTopLeftRadius: "0",
                  padding: "0.5rem",
                  fontSize: "0.625rem",
                  fontWeight: "bold",
                  overflow: "hidden",
                  // scale font size down if label is too long
                }}
              >
                {Object.entries(comboProps).map(([prop, value]) => (
                  <div key={[prop, value].join("-")}>
                    <span
                      style={{
                        color: fontColor,
                        opacity: 0.375,
                      }}
                    >
                      {prop}:{" "}
                    </span>
                    <span
                      style={{
                        color: fontColor,
                        opacity: 0.8,
                      }}
                    >
                      {truncateValue(value)}
                    </span>
                  </div>
                ))}
              </pre>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function getCombinations<C extends ComponentType>(
  propsToCombine: PropsToCombine<C>
): JSX.LibraryManagedAttributes<C, React.ComponentPropsWithRef<C>>[] {
  return Object.entries(propsToCombine).reduce(
    (acc, [key, values]) => {
      const combinations = [];
      for (const value of values) {
        for (const combination of acc) {
          combinations.push({
            ...combination,
            // eslint-disable-next-line -- This is fine for now 🔥🙂🔥
            [key]: value,
          });
        }
      }
      return combinations;
    },
    [{}]
  ) as JSX.LibraryManagedAttributes<C, React.ComponentPropsWithRef<C>>[];
}
