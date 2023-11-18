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
 */
export function modulateGridCols(value: number, maxCols = 5): number {
  return value > maxCols ? Math.ceil(value / 2) : value;
}

export function Combinations<C extends ComponentType>({
  component,
  propsToCombine,
  componentProps,
  columns,
  ...props
}: AllCombinationsProps<C>): JSX.Element | null {
  const combinations = getCombinations(propsToCombine);
  const firstPropKey = Object.keys(propsToCombine)[0] ?? "";
  const firstPropLength: number =
    firstPropKey === "" ? 1 : propsToCombine[firstPropKey]?.length ?? 1;
  let _columns = columns ?? firstPropLength;

  if (columns === undefined) _columns = modulateGridCols(_columns);

  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        placeItems: "center",
        gap: "1rem",
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
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <Component {...comboProps} {...componentProps}>
                {comboProps?.children ?? componentProps?.children ?? null}
              </Component>
            </div>
            {typeof label === "string" && label.length > 0 ? (
              <pre
                style={{
                  borderRadius: "0.5rem",
                  border: "1px solid",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                }}
              >
                {label}
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
