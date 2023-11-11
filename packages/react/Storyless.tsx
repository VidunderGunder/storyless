import * as React from "react";
import { useState } from "react";
import styles from "./Storyless.module.css";

export type StorylessProps = {
  components: Record<string, React.ReactNode>;
} & React.ComponentPropsWithoutRef<"div">;

export const Storyless = React.forwardRef<HTMLDivElement, StorylessProps>(
  function Storyless({ components, className, children, ...props }, ref) {
    const [show, setShow] = useState(false);

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

    return (
      <>
        {show ? (
          <div className={`${styles.container} ${className}`} {...props}>
            <div className={styles.fullHeightWidth}>
              <div className={styles.sidebar}>
                {Object.keys(components).map((componentName) => {
                  const isSelected = componentName === selectedComponent;
                  return (
                    <div key={componentName}>
                      <button
                        onClick={() => setSelectedComponent(componentName)}
                        className={
                          isSelected
                            ? styles.selectedButton
                            : styles.unselectedButton
                        }
                      >
                        {componentName}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={styles.content}>
                <SelectedComponent />
              </div>
            </div>
          </div>
        ) : null}
        <button
          className={styles.fixedButton}
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Hide" : "Storyless"}
        </button>
      </>
    );
  }
);