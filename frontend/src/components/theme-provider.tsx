'use client'

import type { ThemeProviderProps } from 'react-bootstrap/esm/ThemeProvider'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>
}
