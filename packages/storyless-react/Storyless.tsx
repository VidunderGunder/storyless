"use client";
import { forwardRef, useEffect, useState } from "react";
import styles from "./Storyless.module.css";
import reset from "./reset.module.css";
import { cn } from "./utils/cn";
import { useIsMounted, usePersistentState } from "./hooks";

export type StorylessProps = {
  components: Record<string, React.ReactNode>;
} & React.ComponentPropsWithoutRef<"div">;

export const Storyless = forwardRef<HTMLDivElement, StorylessProps>(
  function Storyless({ components, className, children, ...props }, ref) {
    const isMounted = useIsMounted();
    const [show, setShow] = usePersistentState<boolean>(
      "storyless-show",
      false
    );
    const [selectedComponent, setSelectedComponent] = useState<
      keyof typeof components | undefined
    >(Object.keys(components)[0] ?? undefined);

    const SelectedComponent = () =>
      typeof selectedComponent === "string" &&
      selectedComponent in components ? (
        components?.[selectedComponent] ?? null
      ) : (
        <>Add components to see them here 👀</>
      );

    useEffect(() => {
      const handleKeyDown: typeof window.onkeydown = (event) => {
        if (event.key === "Escape") setShow(false);
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => void window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!isMounted) return null;

    return (
      <>
        {show ? (
          <div
            className={cn(reset.reset, styles.container, className)}
            {...props}
          >
            <div className={styles.fullHeightWidth}>
              <div className={styles.sidebar}>
                {Object.keys(components).map((componentName) => {
                  const isSelected = componentName === selectedComponent;
                  return (
                    <div key={componentName}>
                      <button
                        onClick={() => setSelectedComponent(componentName)}
                        className={cn(
                          isSelected
                            ? styles.selectedButton
                            : styles.unselectedButton
                        )}
                      >
                        {componentName}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={cn(styles.content, reset.storylessPreview)}>
                <SelectedComponent />
              </div>
            </div>
          </div>
        ) : null}
        <button
          className={styles.fixedButton}
          onClick={() => setShow((prev) => !prev)}
        >
          Toggle
        </button>
      </>
    );
  }
);
