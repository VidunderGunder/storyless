"use client";
import { forwardRef, useEffect } from "react";
import styles from "./storyless.module.css";
import { cn } from "./utils/cn";
import { useIsMounted, usePersistentState } from "./hooks";

export type StorylessProps = {
  components: Record<string, React.ReactNode>;
  wrapper?: (props: { children: React.ReactNode }) => JSX.Element;
} & Omit<React.ComponentPropsWithoutRef<"div">, "childen">;

export const Storyless = forwardRef<HTMLDivElement, StorylessProps>(
  function Storyless(
    {
      components = {},
      wrapper = ({ children }) => children,
      className,
      ...props
    },
    ref
  ) {
    const Wrapper = wrapper;
    const isMounted = useIsMounted();
    const [show, setShow] = usePersistentState<boolean>(
      "storyless-show",
      false
    );
    const [selected, setSelected] = usePersistentState<
      keyof typeof components | undefined
    >("storyless-selected-component", Object.keys(components)[0] ?? undefined);

    useEffect(() => {
      const handleKeyDown: typeof window.onkeydown = (event) => {
        if (event.key === "Escape") setShow(false);
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [setShow]);

    if (!isMounted) return null;

    return (
      <>
        {show ? (
          <div
            className={cn(styles.storyless, styles.container, className)}
            ref={ref}
            {...props}
          >
            <div className={styles.fullHeightWidth}>
              <div className={styles.sidebar}>
                {Object.keys(components).map((componentName) => {
                  const isSelected = componentName === selected;
                  return (
                    <div key={componentName}>
                      <button
                        className={
                          isSelected
                            ? styles.selectedButton
                            : styles.unselectedButton
                        }
                        onClick={() => {
                          setSelected(componentName);
                        }}
                        type="button"
                      >
                        {componentName}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={cn(styles.preview)}>
                <Wrapper>
                  {typeof selected === "string" && selected in components ? (
                    components[selected] ?? null
                  ) : (
                    <>Add components to see them here 👀</>
                  )}
                </Wrapper>
              </div>
            </div>
          </div>
        ) : null}
        <button
          className={cn(styles.fixedButton)}
          onClick={() => {
            setShow((prev) => !prev);
          }}
          type="button"
        >
          {show ? " Hide" : "Show"} Storyless
        </button>
      </>
    );
  }
);
