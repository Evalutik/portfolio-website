'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

interface TooltipState {
    show: boolean
    text: string
    position: { x: number; y: number }
}

interface KeypadButtonProps {
    id: string
    text?: string
    icon?: React.ReactNode
    variant: 'single' | 'double'
    isLeft?: boolean
    hue?: number
    saturation?: number
    brightness?: number
    onClick?: () => void
    href?: string
    audioRef?: React.RefObject<HTMLAudioElement | null>
    tooltip?: string
    smallText?: boolean
    onTooltipChange?: (show: boolean, text: string, rect: DOMRect | null) => void
}

function KeypadButton({
    id,
    text,
    icon,
    variant,
    isLeft = false,
    hue = 0,
    saturation = 1,
    brightness = 1,
    onClick,
    href,
    audioRef,
    tooltip,
    smallText = false,
    onTooltipChange,
}: KeypadButtonProps) {
    const [isPressed, setIsPressed] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const playSound = useCallback(() => {
        if (audioRef?.current) {
            const audio = audioRef.current
            audio.currentTime = 0
            audio.volume = 1
            audio.play().catch(() => { })
        }
    }, [audioRef])

    const handlePointerDown = useCallback(() => {
        setIsPressed(true)
        playSound()
    }, [playSound])

    const handlePointerUp = useCallback(() => {
        setIsPressed(false)
    }, [])

    const handleClick = useCallback(() => {
        if (href) {
            const element = document.querySelector(href)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
        onClick?.()
    }, [href, onClick])

    const handleMouseEnter = useCallback(() => {
        if (tooltip && onTooltipChange) {
            tooltipTimeoutRef.current = setTimeout(() => {
                const rect = buttonRef.current?.getBoundingClientRect() || null
                onTooltipChange(true, tooltip, rect)
            }, 500)
        }
    }, [tooltip, onTooltipChange])

    const handleMouseLeave = useCallback(() => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current)
            tooltipTimeoutRef.current = null
        }
        onTooltipChange?.(false, '', null)
    }, [onTooltipChange])

    const imageSrc = variant === 'single'
        ? '/keypad/keypad-single.png'
        : '/keypad/keypad-double.png'

    const buttonClasses = [
        'key',
        variant === 'single' ? 'keypad__single' : 'keypad__double',
        isLeft ? 'keypad__single--left' : '',
    ].filter(Boolean).join(' ')

    const textClasses = smallText ? 'key__text key__text--small' : 'key__text'

    return (
        <button
            ref={buttonRef}
            id={id}
            className={buttonClasses}
            data-pressed={isPressed}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => {
                handlePointerUp()
                handleMouseLeave()
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
                '--hue': hue,
                '--saturate': saturation,
                '--brightness': brightness,
            } as React.CSSProperties}
        >
            <span className="key__mask">
                <span className="key__content">
                    <span className={textClasses}>
                        {icon || text}
                    </span>
                    <Image
                        src={imageSrc}
                        alt=""
                        width={variant === 'single' ? 200 : 300}
                        height={variant === 'single' ? 200 : 250}
                        className="key__img"
                    />
                </span>
            </span>
        </button>
    )
}

interface KeypadProps {
    onMagicClick?: () => void
}

export function Keypad({ onMagicClick }: KeypadProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const keypadRef = useRef<HTMLDivElement>(null)
    const [tooltip, setTooltip] = useState<TooltipState>({ show: false, text: '', position: { x: 0, y: 0 } })
    const [audioReady, setAudioReady] = useState(false)

    // Preload sound on mount
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleCanPlay = () => {
            setAudioReady(true)
        }

        audio.addEventListener('canplaythrough', handleCanPlay)
        audio.load()

        return () => {
            audio.removeEventListener('canplaythrough', handleCanPlay)
        }
    }, [])

    const handleTooltipChange = useCallback((show: boolean, text: string, rect: DOMRect | null) => {
        if (show && rect && keypadRef.current) {
            const keypadRect = keypadRef.current.getBoundingClientRect()
            // Position tooltip near the button (use center + small offset)
            setTooltip({
                show: true,
                text,
                position: {
                    x: rect.left + rect.width * 0.6 - keypadRect.left,
                    y: rect.top - keypadRect.top - 4,
                }
            })
        } else {
            setTooltip({ show: false, text: '', position: { x: 0, y: 0 } })
        }
    }, [])

    return (
        <div ref={keypadRef} className="keypad">
            {/* Hidden audio for click sound */}
            <audio ref={audioRef} src="/keypad/keypad-click.mp3" preload="auto" />

            <div className="keypad__base">
                <Image
                    src="/keypad/keypad-base.png"
                    alt=""
                    width={400}
                    height={310}
                />
            </div>

            {/* Left small key - purple/magic - triggers typing effect */}
            <KeypadButton
                id="key-magic"
                icon={<Sparkles className="w-5 h-5" />}
                variant="single"
                isLeft={true}
                hue={345}
                saturation={1.5}
                brightness={0.9}
                onClick={onMagicClick}
                audioRef={audioRef}
                tooltip="Magic button"
                onTooltipChange={handleTooltipChange}
            />

            {/* Right small key - darker gray - contact */}
            <KeypadButton
                id="key-contact"
                text="me."
                variant="single"
                hue={0}
                saturation={0}
                brightness={1.0}
                href="#contact"
                audioRef={audioRef}
                tooltip="Contact me"
                onTooltipChange={handleTooltipChange}
            />

            {/* Large key - dark - projects */}
            <KeypadButton
                id="key-projects"
                text="projects."
                variant="double"
                hue={0}
                saturation={0}
                brightness={0.4}
                href="#projects"
                audioRef={audioRef}
                tooltip="View my projects"
                smallText={true}
                onTooltipChange={handleTooltipChange}
            />

            {/* Tooltip rendered at keypad level - outside clip-path */}
            {tooltip.show && (
                <div
                    className="keypad-tooltip-global keypad-tooltip-right"
                    style={{
                        left: tooltip.position.x,
                        top: tooltip.position.y,
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    )
}
