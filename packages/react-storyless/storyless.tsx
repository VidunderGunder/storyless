"use client";
import React, { forwardRef, useEffect } from "react";
import { useIsMounted, usePersistentState } from "./hooks";

export type StorylessProps = {
  components: Record<string, React.ReactNode>;
  wrapper?: (props: { children: React.ReactNode }) => JSX.Element;
} & Omit<React.ComponentPropsWithoutRef<"div">, "childen">;

const fontFamilies = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
].join(", ");

export const Storyless = forwardRef<HTMLDivElement, StorylessProps>(
  function Storyless(
    { components = {}, wrapper = ({ children }) => children, ...props },
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
            ref={ref}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              overflowY: "hidden",
              backgroundColor: "#12191f",
              // Tailwind font styles
              fontFamily: fontFamilies,
              // Add other styles that were in styles.storyless and styles.container
            }}
            {...props}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                width: "100%",
                maxHeight: "100vh",
                // Add other styles that were in styles.fullHeightWidth
              }}
            >
              <div
                style={{
                  width: "10rem",
                  maxHeight: "100%",
                  overflowY: "auto",
                  borderRight: "2px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: "#12191f",
                  padding: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  // Add other styles that were in styles.sidebar
                }}
              >
                {Object.keys(components).map((componentName) => {
                  const isSelected = componentName === selected;
                  return (
                    <div key={componentName}>
                      <button
                        onClick={() => {
                          setSelected(componentName);
                        }}
                        style={{
                          textAlign: "right",
                          backgroundColor: isSelected
                            ? "rgba(255, 255, 255, 0.1)"
                            : "transparent",
                          color: isSelected
                            ? "rgba(255, 255, 255, 1)"
                            : "rgba(255, 255, 255, 0.5)",
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          // Add other styles that were in styles.selectedButton or styles.unselectedButton
                        }}
                        type="button"
                      >
                        {componentName}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  borderRadius: 0,
                  width: "100%",
                  maxWidth: "100%",
                  overflow: "auto",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "#12191f",
                  padding: 0,
                  margin: 0,
                  // Add other styles that were in styles.preview
                }}
              >
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
          onClick={() => {
            setShow((prev) => !prev);
          }}
          style={{
            position: "fixed",
            bottom: "min(max(0.5rem, 2vw), 2rem)",
            right: "min(max(0.5rem, 2.25vw), 3rem)",
            backgroundColor: "#12191f",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: "9999px",
            padding: "0.75rem",
            width: "9rem",
            height: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 9999,
            fontSize: "0.875rem",
            userSelect: "none",

            fontFamily: fontFamilies,
          }}
          type="button"
        >
          {show ? " Hide" : "Show"} Storyless
        </button>
      </>
    );
  }
);
