"use client";
import React, { useEffect, useState } from "react";
import { useIsMounted, usePersistentState } from "./hooks";

export type StorylessProps = {
  components: Record<string, React.ReactNode>;
  wrapper?: (props: { children: React.ReactNode }) => JSX.Element;
  buttonProps?: React.ComponentPropsWithoutRef<"button">;
} & Omit<React.ComponentPropsWithoutRef<"div">, "childen">;

const originalScrollPosition = { x: 0, y: 0 };

/**
 * Disables scrolling on any app Storyless is imported into.
 * Fixes the position of the content to prevent scrolling.
 */
function disableAppScrolling({ onDisable }: { onDisable?: () => void }): void {
  // Store the current scroll position
  originalScrollPosition.x =
    window.pageXOffset || document.documentElement.scrollLeft;
  originalScrollPosition.y =
    window.pageYOffset || document.documentElement.scrollTop;

  // Fix the position of the content
  document.documentElement.style.position = "fixed";
  document.documentElement.style.top = `-${originalScrollPosition.y}px`;
  document.documentElement.style.left = `-${originalScrollPosition.x}px`;
  document.documentElement.style.overflow = "hidden"; // For HTML
  document.body.style.overflow = "hidden"; // For Body

  onDisable?.();
}

/**
 * Re-enables original scrolling on any app Storyless is imported into.
 * Unfixes the position of the content and restores original scroll.
 */
function enableAppScrolling({ onEnable }: { onEnable?: () => void }): void {
  // Unfix the position of the content
  document.documentElement.style.position = "";
  document.documentElement.style.top = "";
  document.documentElement.style.left = "";
  document.documentElement.style.overflow = ""; // For HTML
  document.body.style.overflow = ""; // For Body

  // Restore the original scroll position
  window.scrollTo(originalScrollPosition.x, originalScrollPosition.y);

  onEnable?.();
}

// eslint-disable-next-line import/no-named-as-default-member -- We want to export the component as default
export const Storyless = React.forwardRef<HTMLDivElement, StorylessProps>(
  function Storyless(
    { components = {}, wrapper = DefaultWrapper, style, buttonProps, ...props },
    ref
  ) {
    const Wrapper = wrapper;
    const isMounted = useIsMounted();
    const [y, setY] = useState(0);
    const [x, setX] = useState(0);
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

    function handleOpen(): void {
      setShow(true);
      disableAppScrolling({
        onDisable() {
          setY(window.scrollY);
          setX(window.scrollX);
        },
      });
    }

    function handleClose(): void {
      setShow(false);
      enableAppScrolling({
        onEnable() {
          window.scrollTo(x, y);
        },
      });
    }

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
              zIndex: 9999,
              ...style,
            }}
            {...props}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                width: "100%",
                maxHeight: "100vh",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "10rem",
                  maxHeight: "100%",
                  borderRight: "1px solid rgba(255, 255, 255, 0.025)",
                  boxShadow: `
                    0 1px 0 6px rgba(0, 0, 0, 0.05)
                  `,
                  backgroundColor: "#12191f",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "0.25rem",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxHeight: "100%",
                    overflowY: "auto",
                    backgroundColor: "#12191f",
                    padding: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
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
                            fontFamily: fontFamilies,
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
                    width: "100%",
                    maxHeight: "100%",
                    overflowY: "auto",
                    backgroundColor: "#12191f",
                    padding: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <button
                    onClick={handleClose}
                    style={{
                      fontFamily: fontFamilies,
                      backgroundColor: "rgba(255, 255, 255, 0.01)",
                      boxShadow: `
                        inset 0 1px 0px 0px rgba(255, 255, 255, 0.05),
                        inset 0 -2px 0px 0px rgba(0, 0, 0, 0.75),
                        0 0 0 3.5px rgba(0, 0, 0, 0.25)
                        `,
                      color: "rgba(255, 255, 255, 0.675)",
                      width: "100%",
                      padding: "0.675rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "100%",
                  height: "100%",
                  padding: "2rem",
                  overflow: "auto",
                }}
              >
                <Wrapper>
                  {typeof selected === "string" && selected in components ? (
                    components[selected] ?? null
                  ) : (
                    <div
                      style={{
                        color: "#12191f",
                        fontSize: "2rem",
                      }}
                    >
                      Add components to see them here 👀
                    </div>
                  )}
                </Wrapper>
              </div>
            </div>
          </div>
        ) : null}
        {show ? null : (
          <button
            onClick={handleOpen}
            style={{
              position: "fixed",
              bottom: "min(max(0.5rem, 1.75vw), 2rem)",
              left: "min(max(0.5rem, 2vw), 3rem)",
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
            {...buttonProps}
          >
            Show Storyless
          </button>
        )}
      </>
    );
  }
);

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
].join(", ");

function DefaultWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        display: "grid",
        placeItems: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
        boxShadow: `
          inset 0 1px 0px 0px rgba(255, 255, 255, 0.1),
          inset 0 -2px 0px 0px rgba(0, 0, 0, 0.125),
          0 1px 0 6px rgba(0, 0, 0, 0.05)
        `,
        backdropFilter: "blur(100px)",
        padding: "1rem 2rem",
        margin: 0,
      }}
    >
      {children}
    </div>
  );
}
