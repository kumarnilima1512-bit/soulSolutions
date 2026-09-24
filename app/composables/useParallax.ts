// layerStyle(strength): strength jototuku beshi, layer totuku beshi nodbe (px).
export function useParallax() {
  const { x, y, enabled } = useMousePosition()

  const layerStyle = (strength = 10) =>
    enabled.value
      ? { transform: `translate3d(${x.value * strength}px, ${y.value * strength}px, 0)` }
      : {}

  return { layerStyle, enabled }
}