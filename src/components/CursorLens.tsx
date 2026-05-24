import * as React from "react"
import {
    motion,
    useMotionValue,
    useSpring,
    useTime,
    useTransform,
    useAnimationFrame,
} from "framer-motion"

export interface CursorLensProps {
    baseImage?: string
    revealImage?: string
    objectFit?: "cover" | "contain"
    backgroundColor?: string
    blobOutlineColor?: string
    parallaxStrength?: number
    showBackground?: boolean
    bgBlobCount?: number
    bgBlobSize?: number
    bgBlobComplexity?: number
    bgBlobSpeed?: number
    blobStrokeWidth?: number
    previewCursor?: boolean
    blobSize?: number
    shapeComplexity?: number
    roughness?: number
    speed?: number
    viscosity?: number
    scale?: number
    backgroundPosition?: string
    trackingTargetId?: string
}

export default function CursorLens({
    baseImage = "/outer image-bgr.png",
    revealImage = "/beard image-inner-bdr.png",
    objectFit = "cover",
    backgroundColor = "transparent",
    blobOutlineColor = "rgba(59, 130, 246, 0.3)",
    parallaxStrength = 8,
    showBackground = true,
    bgBlobCount = 12,
    bgBlobSize = 100,
    bgBlobComplexity = 40,
    bgBlobSpeed = 0.7,
    blobStrokeWidth = 1.5,
    previewCursor = false,
    blobSize = 120,
    shapeComplexity = 0.7,
    roughness = 15,
    speed = 250,
    viscosity = 1.2,
    scale = 1.0,
    backgroundPosition = "center",
    trackingTargetId = "hero",
}: CursorLensProps) {
    const [isHovering, setIsHovering] = React.useState(false)
    const isActive = isHovering || previewCursor

    // Reference to the container for coordinate math
    const containerRef = React.useRef<HTMLDivElement>(null)

    // --- 1. SETUP BACKGROUND BLOBS ---
    const random = (min: number, max: number) => Math.random() * (max - min) + min

    const backgroundBlobs = React.useMemo(() => {
        return [...Array(bgBlobCount)].map(() => ({
            x: [
                random(-20, 110) + "%",
                random(-20, 110) + "%",
                random(-20, 110) + "%",
            ],
            y: [
                random(-20, 110) + "%",
                random(-20, 110) + "%",
                random(-20, 110) + "%",
            ],
            sizeFactor: random(0.5, 1.5),
            duration: random(25, 50) / bgBlobSpeed,
        }))
    }, [bgBlobCount, bgBlobSpeed])

    const bgFilterId = React.useId()

    // --- 2. MOUSE & PARALLAX PHYSICS ---
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const mouseXRatio = useMotionValue(0)
    const mouseYRatio = useMotionValue(0)

    const smoothOptions = { damping: 50, stiffness: 400 }
    const smoothX = useSpring(mouseXRatio, smoothOptions)
    const smoothY = useSpring(mouseYRatio, smoothOptions)

    const baseX = useTransform(
        smoothX,
        [-1, 1],
        [parallaxStrength, -parallaxStrength]
    )
    const baseY = useTransform(
        smoothY,
        [-1, 1],
        [parallaxStrength, -parallaxStrength]
    )
    const revealX = useTransform(
        smoothX,
        [-1, 1],
        [parallaxStrength * 2.5, -parallaxStrength * 2.5]
    )
    const revealY = useTransform(
        smoothY,
        [-1, 1],
        [parallaxStrength * 2.5, -parallaxStrength * 2.5]
    )

    // --- 2.5. AUTOMATIC IDLE PREVIEW ANIMATION ---
    // If the user is not actively hovering, we smoothly glide the lens in a slow, S-rank
    // figure-8 loop (Lissajous curve) to keep the portal alive and display the 3D effect.
    useAnimationFrame((t) => {
        if (!isHovering && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const centerX = rect.width / 2
            const centerY = rect.height / 2

            // Figure-8 pattern parameters
            const radiusX = rect.width * 0.22
            const radiusY = rect.height * 0.22
            const speedX = 0.0008 // Elegant slow sweeping speed
            const speedY = 0.0016 // Twice as fast in Y for figure-8 geometry

            const x = centerX + Math.sin(t * speedX) * radiusX
            const y = centerY + Math.sin(t * speedY) * radiusY

            mouseX.set(x)
            mouseY.set(y)
            mouseXRatio.set((x / rect.width) * 2 - 1)
            mouseYRatio.set((y / rect.height) * 2 - 1)
        }
    })

    // --- 3. GLOBAL TRACKING LOGIC ---
    React.useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            
            let clientX: number
            let clientY: number

            if ("touches" in e && e.touches.length > 0) {
                clientX = e.touches[0].clientX
                clientY = e.touches[0].clientY
            } else if ("clientX" in e) {
                clientX = (e as MouseEvent).clientX
                clientY = (e as MouseEvent).clientY
            } else {
                return
            }

            // Check if the mouse is physically inside the designated target area (e.g. entire hero section)
            const targetEl = trackingTargetId ? document.getElementById(trackingTargetId) : null
            const targetRect = targetEl ? targetEl.getBoundingClientRect() : rect

            const isInside =
                clientX >= targetRect.left &&
                clientX <= targetRect.right &&
                clientY >= targetRect.top &&
                clientY <= targetRect.bottom

            setIsHovering(isInside)

            if (isInside) {
                const x = clientX - rect.left
                const y = clientY - rect.top

                mouseX.set(x)
                mouseY.set(y)
                mouseXRatio.set((x / rect.width) * 2 - 1)
                mouseYRatio.set((y / rect.height) * 2 - 1)
            } else {
                mouseXRatio.set(0)
                mouseYRatio.set(0)
            }
        }

        window.addEventListener("mousemove", handleGlobalMove)
        window.addEventListener("touchstart", handleGlobalMove)
        window.addEventListener("touchmove", handleGlobalMove)

        return () => {
            window.removeEventListener("mousemove", handleGlobalMove)
            window.removeEventListener("touchstart", handleGlobalMove)
            window.removeEventListener("touchmove", handleGlobalMove)
        }
    }, [mouseX, mouseY, mouseXRatio, mouseYRatio, trackingTargetId])

    // --- 4. FLUID CURSOR PHYSICS ---
    const time = useTime()

    const createWake = (index: number) => {
        const stiffness = speed * (1 - index * 0.15)
        const damping = 20 + viscosity * index * 5
        const mass = 0.1 + index * 0.1
        return {
            x: useSpring(mouseX, { stiffness, damping, mass }),
            y: useSpring(mouseY, { stiffness, damping, mass }),
        }
    }

    const head = createWake(0)
    const body1 = createWake(1)
    const body2 = createWake(2)
    const tail = createWake(4)

    const complexityRadius = blobSize * shapeComplexity * 0.6
    const sat1X = useTransform(
        time,
        (t) => head.x.get() + Math.sin(t * 0.002) * complexityRadius
    )
    const sat1Y = useTransform(
        time,
        (t) => head.y.get() + Math.cos(t * 0.002) * complexityRadius
    )
    const sat2X = useTransform(
        time,
        (t) => head.x.get() + Math.cos(t * 0.004) * (complexityRadius * 0.8)
    )
    const sat2Y = useTransform(
        time,
        (t) => head.y.get() + Math.sin(t * 0.004) * (complexityRadius * 0.8)
    )

    const cursorFilterId = React.useId()
    const maskId = React.useId()
    const baseMaskId = React.useId()

    return (
        <div
            ref={containerRef}
            style={{ ...containerStyle, backgroundColor: backgroundColor }}
        >
            {showBackground && (
                <>
                    <svg width="0" height="0" style={{ position: "absolute" }}>
                        <defs>
                            <filter id={bgFilterId}>
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.008"
                                    numOctaves="3"
                                    result="noise"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale={bgBlobComplexity}
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                />
                            </filter>
                        </defs>
                    </svg>

                    <svg
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            zIndex: 0,
                            overflow: "visible",
                        }}
                    >
                        <g filter={`url(#${bgFilterId})`}>
                            {backgroundBlobs.map((blob, i) => (
                                <motion.circle
                                    key={i}
                                    initial={{ cx: blob.x[0], cy: blob.y[0] }}
                                    animate={{ cx: blob.x, cy: blob.y }}
                                    transition={{
                                        duration: blob.duration,
                                        repeat: Infinity,
                                        repeatType: "mirror",
                                        ease: "easeInOut",
                                    }}
                                    r={blob.sizeFactor * bgBlobSize}
                                    fill="none"
                                    stroke={blobOutlineColor}
                                    strokeWidth={blobStrokeWidth}
                                    strokeOpacity={0.5}
                                />
                            ))}
                        </g>
                    </svg>
                </>
            )}

            <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                    <linearGradient id="portalOutlineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
                        <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
                        <stop offset="100%" stopColor="#C084FC" stopOpacity="1" />
                    </linearGradient>
                    <filter id={cursorFilterId}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.015"
                            numOctaves="2"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={roughness}
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="distorted"
                        />
                        <feGaussianBlur
                            in="distorted"
                            stdDeviation="12"
                            result="blur"
                        />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                            result="goo"
                        />
                        <feComposite
                            in="SourceGraphic"
                            in2="goo"
                            operator="atop"
                        />
                    </filter>
                </defs>
            </svg>

            <svg
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    opacity: 0,
                }}
            >
                <defs>
                    <mask id={maskId}>
                        <g filter={`url(#${cursorFilterId})`}>
                            <motion.g
                                animate={{ opacity: isActive ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.circle
                                    cx={sat1X}
                                    cy={sat1Y}
                                    r={blobSize * 0.6}
                                    fill="white"
                                />
                                <motion.circle
                                    cx={sat2X}
                                    cy={sat2Y}
                                    r={blobSize * 0.5}
                                    fill="white"
                                />
                                <motion.circle
                                    cx={head.x}
                                    cy={head.y}
                                    r={blobSize * 0.7}
                                    fill="white"
                                />
                                <motion.circle
                                    cx={body1.x}
                                    cy={body1.y}
                                    r={blobSize * 0.6}
                                    fill="white"
                                />
                                <motion.circle
                                    cx={body2.x}
                                    cy={body2.y}
                                    r={blobSize * 0.5}
                                    fill="white"
                                />
                                <motion.circle
                                    cx={tail.x}
                                    cy={tail.y}
                                    r={blobSize * 0.3}
                                    fill="white"
                                />
                            </motion.g>
                        </g>
                    </mask>

                    {/* Subtractive mask for the base image layer (renders base image everywhere EXCEPT inside the hover portal circles) */}
                    <mask id={baseMaskId}>
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <g filter={`url(#${cursorFilterId})`}>
                            <motion.g
                                animate={{ opacity: isActive ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.circle
                                    cx={sat1X}
                                    cy={sat1Y}
                                    r={blobSize * 0.6}
                                    fill="black"
                                />
                                <motion.circle
                                    cx={sat2X}
                                    cy={sat2Y}
                                    r={blobSize * 0.5}
                                    fill="black"
                                />
                                <motion.circle
                                    cx={head.x}
                                    cy={head.y}
                                    r={blobSize * 0.7}
                                    fill="black"
                                />
                                <motion.circle
                                    cx={body1.x}
                                    cy={body1.y}
                                    r={blobSize * 0.6}
                                    fill="black"
                                />
                                <motion.circle
                                    cx={body2.x}
                                    cy={body2.y}
                                    r={blobSize * 0.5}
                                    fill="black"
                                />
                                <motion.circle
                                    cx={tail.x}
                                    cy={tail.y}
                                    r={blobSize * 0.3}
                                    fill="black"
                                />
                            </motion.g>
                        </g>
                    </mask>
                </defs>
            </svg>

            {/* Base Image Layer (with subtractive mask applied to cut out the hover circles) */}
            <div style={{ 
                ...layerContainerStyle, 
                mask: `url(#${baseMaskId})`,
                WebkitMask: `url(#${baseMaskId})`,
                zIndex: 10 
            }}>
                <motion.div
                    style={{
                        ...imageStyle,
                        backgroundImage: `url("${baseImage}")`,
                        backgroundSize: objectFit,
                        backgroundPosition: backgroundPosition,
                        x: baseX,
                        y: baseY,
                        scale: scale,
                    }}
                />
            </div>

            {/* Reveal Image Layer (with standard reveal mask applied to only show inside the hover circles) */}
            <motion.div
                style={{
                    ...layerContainerStyle,
                    mask: `url(#${maskId})`,
                    WebkitMask: `url(#${maskId})`,
                    zIndex: 20,
                }}
            >
                <motion.div
                    style={{
                        ...imageStyle,
                        backgroundImage: `url("${revealImage}")`,
                        backgroundSize: objectFit,
                        backgroundPosition: backgroundPosition,
                        x: baseX,
                        y: baseY,
                        scale: scale,
                    }}
                />
            </motion.div>

            {/* Liquid Glowing Outline Layer */}
            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 25,
                }}
            >
                <g filter={`url(#${cursorFilterId})`}>
                    <motion.g
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.circle
                            cx={sat1X}
                            cy={sat1Y}
                            r={blobSize * 0.6}
                            fill="none"
                            stroke="url(#portalOutlineGradient)"
                            strokeWidth="5"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.85)) drop-shadow(0 0 16px rgba(168, 85, 247, 0.6))' }}
                        />
                        <motion.circle
                            cx={sat2X}
                            cy={sat2Y}
                            r={blobSize * 0.5}
                            fill="none"
                            stroke="url(#portalOutlineGradient)"
                            strokeWidth="5"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.85))' }}
                        />
                        <motion.circle
                            cx={head.x}
                            cy={head.y}
                            r={blobSize * 0.7}
                            fill="none"
                            stroke="url(#portalOutlineGradient)"
                            strokeWidth="6.5"
                            style={{ filter: 'drop-shadow(0 0 14px rgba(124, 58, 237, 0.95)) drop-shadow(0 0 24px rgba(168, 85, 247, 0.75))' }}
                        />
                        <motion.circle
                            cx={body1.x}
                            cy={body1.y}
                            r={blobSize * 0.6}
                            fill="none"
                            stroke="url(#portalOutlineGradient)"
                            strokeWidth="5"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.85))' }}
                        />
                        <motion.circle
                            cx={body2.x}
                            cy={body2.y}
                            r={blobSize * 0.5}
                            fill="none"
                            stroke="url(#portalOutlineGradient)"
                            strokeWidth="5"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.85))' }}
                        />
                        <motion.circle
                            cx={tail.x}
                            cy={tail.y}
                            r={blobSize * 0.3}
                            fill="none"
                            stroke="url(#portalOutlineGradient)"
                            strokeWidth="4"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.8))' }}
                        />
                    </motion.g>
                </g>
            </svg>
        </div>
    )
}

const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: "24px",
}

const layerContainerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
}

const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    willChange: "transform",
}
