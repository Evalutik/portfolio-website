'use client'

import { LoadingScreen } from '@/components/ui/LoadingScreen'

interface PageWrapperProps {
    children: React.ReactNode
}

/**
 * Client wrapper that shows loading screen before page content
 */
export function PageWrapper({ children }: PageWrapperProps) {
    return (
        <>
            <LoadingScreen />
            {children}
        </>
    )
}
