// GSAP-based animation effects for Animated Weather Card

import type { GSAPTimeline } from './types';
import { DEFAULT_ENGINE_SETTINGS } from './constants';

/** Leaf speed range in px/s at the default wind. */
export const LEAF_SPEED: [number, number] = [90, 160];

/**
 * Create GSAP-animated leaf. Leaves cross at a constant speed and only
 * fade once they're past the card's edge; the wind carries some up and
 * lets weak gusts drop others.
 */
export function createGSAPLeaf(windLayer: Element, settings: any, scale: number, cardElement: HTMLElement,
                               onRemove?: (el: HTMLElement) => void, spill = true): HTMLElement {
    const leaf = document.createElement('div');
    leaf.className = 'leaf-gsap';

    const cardWidth = cardElement.offsetWidth;
    const cardHeight = cardElement.offsetHeight;
    const startY = 20 + Math.random() * Math.max(40, cardHeight - 40);

    const gust = Math.random();
    const isWeak = gust < 0.25;
    const isUpdraft = gust > 0.8 && startY > 100;

    leaf.style.position = 'absolute';
    leaf.style.borderRadius = '0 100% 0 100%';
    leaf.style.transformOrigin = 'center';
    leaf.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';

    const leafSize = (Math.random() * 8 + 6) * scale;
    leaf.style.width = leaf.style.height = leafSize + 'px';

    const colors = ['#27ae60', '#2ecc71', '#16a085', '#f39c12', '#e67e22', '#e74c3c'];
    leaf.style.background = colors[Math.floor(Math.random() * colors.length)];

    const startX = -leafSize - 10;
    // Out past the right edge: onto the dashboard with spill, just behind
    // the frame without it.
    const exitX = cardWidth + (spill ? 60 + Math.random() * 80 : leafSize + 10);
    const speed = (LEAF_SPEED[0] + Math.random() * (LEAF_SPEED[1] - LEAF_SPEED[0]))
        * driftWindFactor(settings.windSpeed) * (isWeak ? 0.6 : 1);
    const duration = (exitX - startX) / speed;
    const edgeSec = Math.min(duration, (cardWidth - startX) / speed);
    const rise = isUpdraft ? -(60 + Math.random() * 80) : isWeak ? 80 + Math.random() * 80 : (Math.random() - 0.5) * 80;

    window.AnimatedWeatherCardGsap.set(leaf, { x: startX, y: startY, rotation: Math.random() * 360, opacity: 0 });
    windLayer.appendChild(leaf);

    const tl = window.AnimatedWeatherCardGsap.timeline({
        onComplete: () => {
            if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
            if (onRemove) onRemove(leaf);
        }
    });
    tl.to(leaf, { opacity: 0.85, duration: 0.25, ease: 'power1.out' }, 0)
      .to(leaf, { x: exitX, duration, ease: 'none' }, 0)
      .to(leaf, { y: startY + rise, duration, ease: isWeak ? 'sine.in' : 'sine.inOut' }, 0)
      .to(leaf, { rotation: `+=${120 + Math.random() * 180}`, duration, ease: 'none' }, 0);
    if (spill && duration > edgeSec) {
        tl.to(leaf, { opacity: 0, duration: duration - edgeSec, ease: 'power1.in' }, edgeSec);
    }
    return leaf;
}

/**
 * Create GSAP-animated wind swoosh: a faint streak of moving air.
 */
export function createGSAPSwoosh(windLayer: Element, settings: any, scale: number, cardElement: HTMLElement, config: any, onRemove?: (el: HTMLElement) => void): HTMLElement {
    const swoosh = document.createElement('div');
    swoosh.className = 'wind-swoosh-gsap';

    const swooshType = Math.random();
    const isCurved = swooshType > 0.6;
    const isStrong = swooshType > 0.8;

    swoosh.style.position = 'absolute';
    swoosh.style.height = (isStrong ? 2 : 1) * scale + 'px';
    swoosh.style.borderRadius = isCurved ? '2px 1px' : '1px';
    swoosh.style.transformOrigin = 'left center';
    swoosh.style.zIndex = '10';

    const windColor = config.color_palette === 'theme' ? 'var(--secondary-text-color)' : 'rgb(255, 255, 255)';
    swoosh.style.background = `linear-gradient(90deg, transparent 0%, ${windColor} 50%, transparent 100%)`;

    const swooshWidth = Math.max(15, (20 + Math.random() * 60) * scale);
    swoosh.style.width = swooshWidth + 'px';

    const cardWidth = cardElement.offsetWidth;
    const cardHeight = cardElement.offsetHeight;
    const startY = (cardHeight * 0.15) + Math.random() * (cardHeight * 0.7);

    window.AnimatedWeatherCardGsap.set(swoosh, {
        x: -swooshWidth,
        y: startY,
        rotation: isCurved ? -5 + Math.random() * 10 : 0,
        scaleX: 0.1,
        scaleY: 1,
        opacity: 0
    });

    windLayer.appendChild(swoosh);

    const distance = cardWidth + swooshWidth * 2;
    const duration = distance / (SWOOSH_SPEED * driftWindFactor(settings.windSpeed));
    const tl = window.AnimatedWeatherCardGsap.timeline({
        onComplete: () => {
            if (swoosh.parentNode) swoosh.parentNode.removeChild(swoosh);
            if (onRemove) onRemove(swoosh);
        }
    });

    // Faint: moving air should be felt more than seen
    tl.to(swoosh, { scaleX: 1, opacity: isStrong ? 0.35 : 0.22, duration: 0.3, ease: 'power2.out' }, 0)
      .to(swoosh, {
          x: cardWidth + swooshWidth,
          rotation: isCurved ? (startY > cardHeight / 2 ? 5 : -5) : 0,
          duration,
          ease: 'none'
      }, 0)
      .to(swoosh, { opacity: 0, scaleX: 0.3, duration: Math.min(0.5, duration * 0.3) }, duration - Math.min(0.5, duration * 0.3));
    return swoosh;
}

/** Swoosh speed in px/s at the default wind. */
const SWOOSH_SPEED = 230;

/**
 * Cloud parallax layers, far to near. Speeds are px/s at the default wind
 * effect and 10 km/h; nearer clouds are bigger, brighter and faster.
 */
export const CLOUD_LAYERS = [
    { name: 'background', speed: 6, opacity: 0.26, scale: 0.7, blur: 2.5 },
    { name: 'middle', speed: 12, opacity: 0.5, scale: 0.9, blur: 1.5 },
    { name: 'foreground', speed: 22, opacity: 0.66, scale: 1.2, blur: 0.75 },
] as const;

/**
 * How much wind speeds drifting things up (clouds, leaves, swooshes): 1 at
 * the default wind effect and 10 km/h, growing with the square root so a
 * gale doesn't make them race.
 */
export function driftWindFactor(windSpeed: number): number {
    return Math.min(2.2, Math.max(0.6, Math.sqrt(windSpeed / DEFAULT_ENGINE_SETTINGS.windSpeed)));
}

/** Room past a cloud's edge for its blur, so it's fully out of sight off-card. */
const CLOUD_BLUR_PAD_PX = 12;

/** Remove every cloud and its track, and stop them moving. */
export function removeClouds(root: ParentNode): void {
    root.querySelectorAll('.cloud-track, .cloud-gsap').forEach(el => {
        window.AnimatedWeatherCardGsap?.killTweensOf(el);
        el.remove();
    });
}

/** Cloud size factor for the card's height: 1 from 160px up, down to 0.5. */
export function cloudHeightScale(cardHeight: number): number {
    return Math.min(1, Math.max(0.5, cardHeight / 160)) || 1;
}

/**
 * Create GSAP-animated cloud with parallax layers
 */
export function createGSAPCloud(cloudLayer: Element, settings: any, cloudCount: number, cardElement: HTMLElement, config: any): GSAPTimeline[] {
    // Get card dimensions
    const cardWidth = cardElement.offsetWidth;
    const cardHeight = cardElement.offsetHeight;

    // Parallax layer configuration (3 layers: background, middle, foreground)
    // Slightly dimmed and softened so clouds passing behind the hero text
    // don't compete with it; they still roam the whole sky. Farther clouds
    // are smaller, fainter and slower, so depth reads the right way round.
    const parallaxLayers = CLOUD_LAYERS;
    const windFactor = driftWindFactor(settings.windSpeed);

    const cloudTimelines: GSAPTimeline[] = [];
    const effectiveCloudCount = cloudCount || settings.cloudCount;
    // Short strips (compact cards, one-row sections) get smaller clouds, so
    // a cloud is part of the sky rather than half the card
    const heightScale = cloudHeightScale(cardHeight);

    parallaxLayers.forEach((layer, layerIndex) => {
        // Determine how many clouds to create for this layer (fewer for background, more for foreground)
        const layerCloudCount = layerIndex === 0 ? Math.ceil(effectiveCloudCount * 0.4) :
                               layerIndex === 1 ? Math.ceil(effectiveCloudCount * 0.4) :
                               Math.ceil(effectiveCloudCount * 0.6);

        for (let i = 1; i <= layerCloudCount; i++) {
            const cloud = document.createElement('div');
            cloud.className = `cloud-gsap cloud-gsap-${layer.name}-${i}`;

            // Calculate cloud size with parallax depth
            const baseCloudSize = settings.cloudBaseSize * layer.scale;
            const sizeVariation = 1 + ((i - 1) * 0.15);
            const actualSize = Math.max(0.3, Math.min(2.5, baseCloudSize)) * sizeVariation * heightScale;

            // Base cloud dimensions
            const baseWidth = 70;
            const baseHeight = 26;
            const beforeWidth = 44;
            const beforeHeight = 44;
            const afterWidth = 35;
            const afterHeight = 35;

            // Apply size multiplier
            const width = Math.round(baseWidth * actualSize);
            const height = Math.round(baseHeight * actualSize);

            // Set cloud styling with parallax effects
            cloud.style.position = 'absolute';
            cloud.style.width = width + 'px';
            cloud.style.height = height + 'px';
            cloud.style.borderRadius = '50px';
            cloud.style.opacity = layer.opacity.toString();
            cloud.style.zIndex = (10 + layerIndex).toString();
            
            // Apply blur for depth effect
            if (layer.blur > 0) {
                cloud.style.filter = `blur(${layer.blur}px)`;
            }
            
            // Far clouds are dimmer and cooler, near clouds brightest. The
            // tints come from the sky (condition, time of day, palette).
            const cloudColor = ['var(--awc-cloud-far)', 'var(--awc-cloud-mid)', 'var(--awc-cloud-near)'][layerIndex];
            
            cloud.style.background = cloudColor;

            // Create before pseudo-element as real element
            const beforeElement = document.createElement('div');
            beforeElement.style.position = 'absolute';
            beforeElement.style.width = Math.round(beforeWidth * actualSize) + 'px';
            beforeElement.style.height = Math.round(beforeHeight * actualSize) + 'px';
            beforeElement.style.top = Math.round(-22 * actualSize) + 'px';
            beforeElement.style.left = Math.round(9 * actualSize) + 'px';
            beforeElement.style.borderRadius = '50px';
            beforeElement.style.background = cloudColor;
            cloud.appendChild(beforeElement);

            // Create after pseudo-element as real element
            const afterElement = document.createElement('div');
            afterElement.style.position = 'absolute';
            afterElement.style.width = Math.round(afterWidth * actualSize) + 'px';
            afterElement.style.height = Math.round(afterHeight * actualSize) + 'px';
            afterElement.style.top = Math.round(-13 * actualSize) + 'px';
            afterElement.style.right = Math.round(9 * actualSize) + 'px';
            afterElement.style.borderRadius = '50px';
            afterElement.style.background = cloudColor;
            cloud.appendChild(afterElement);

            // Parallax positioning - different heights and depths
            const heightVariations = [
                [10, 25, 40, 15, 30], // Background - lower in sky
                [20, 45, 60, 35, 50], // Middle - middle heights
                [5, 35, 55, 25, 45]   // Foreground - varied heights
            ];
            
            const topPosition = heightVariations[layerIndex][i - 1] || (15 + layerIndex * 10);
            
            // Start and end fully outside the card, by this much
            const margin = Math.max(150 + layerIndex * 50, width + CLOUD_BLUR_PAD_PX);
            const speed = layer.speed * windFactor * (0.9 + Math.random() * 0.2);
            const duration = (cardWidth + 2 * margin) / speed;

            // The cloud rides a track as wide as the sky. The track's
            // xPercent carries it across the card's width, whatever that
            // width becomes later (a sidebar closes, a tablet turns), and
            // its x adds the margins, so a cloud always enters and leaves
            // out of sight. Both are transforms: no layout per frame.
            const track = document.createElement('div');
            track.className = 'cloud-track';
            track.appendChild(cloud);
            window.AnimatedWeatherCardGsap.set(cloud, { opacity: layer.opacity });
            window.AnimatedWeatherCardGsap.set(track, {
                xPercent: 0,
                x: -margin,
                y: (cardHeight * topPosition) / 100,
            });

            cloudLayer.appendChild(track);

            // Drift across at constant speed, forever. Each cloud starts
            // somewhere along its path, so the sky is already populated.
            const tl = window.AnimatedWeatherCardGsap.timeline({
                repeat: -1,
                repeatDelay: Math.random() * 1.5,
            });
            tl.fromTo(track, { xPercent: 0, x: -margin }, { xPercent: 100, x: margin, duration, ease: 'none' });
            tl.progress(Math.random());

            cloudTimelines.push(tl);
        }
    });

    return cloudTimelines;
}

/**
 * Clear snow accumulation when not snowing
 */
export function clearSnowAccumulation(cardElement: HTMLElement) {
    const snowAccumulation = cardElement.querySelector('.snow-accumulation');
    if (snowAccumulation) {
        if (window.AnimatedWeatherCardGsap) {
            window.AnimatedWeatherCardGsap.to(snowAccumulation, {
                height: '0px',
                duration: 2.0,
                ease: "power2.out",
                onComplete: () => {
                    if (snowAccumulation.parentNode) {
                        snowAccumulation.parentNode.removeChild(snowAccumulation);
                    }
                }
            });
        } else {
            snowAccumulation.parentNode?.removeChild(snowAccumulation);
        }
    }
}

/**
 * Create GSAP-animated fog layer
 */
export function createGSAPFogLayer(fogContainer: Element, settings: any, layerIndex: number, cardElement: HTMLElement, config: any) {
    const fogLayer = document.createElement('div');
    fogLayer.className = `fog-layer fog-layer-${layerIndex}`;

    // Get card dimensions for proper sizing
    const cardWidth = cardElement.offsetWidth;
    const cardHeight = cardElement.offsetHeight;

    // Fog layer properties - create depth with different layers (more subtle)
    const layerConfig = [
        { opacity: 0.1, scale: 1.8, blur: 8, speed: 0.3, height: 80 },  // Background - slow, blurred, very subtle
        { opacity: 0.15, scale: 1.4, blur: 4, speed: 0.5, height: 60 },  // Middle - medium, subtle
        { opacity: 0.12, scale: 1.0, blur: 2, speed: 0.8, height: 40 },  // Foreground - faster, less blur, subtle
    ];

    const layer = layerConfig[layerIndex] || layerConfig[2];

    // Set fog layer styling
    const fogColor = config.color_palette === 'default' ? 
        (config.custom_colors?.fog_color || '#e0e0e0') : 
        'var(--secondary-text-color)';

    // Create more organic fog shape with multiple cloud-like segments
    const segmentCount = 3 + Math.floor(Math.random() * 3); // 3-5 segments per layer
    const totalWidth = cardWidth * layer.scale;
    
    fogLayer.style.cssText = `
        position: absolute;
        top: ${20 + layerIndex * 15}%;
        left: -50%;
        width: ${totalWidth}px;
        height: ${layer.height}px;
        opacity: ${layer.opacity};
        filter: blur(${layer.blur}px);
        pointer-events: none;
        z-index: ${5 + layerIndex};
        overflow: visible;
    `;

    // Create multiple overlapping cloud-like segments for organic fog appearance
    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const segmentWidth = totalWidth / segmentCount * (2.0 + Math.random() * 1.2); // Much bigger, overlapping segments
        const segmentHeight = layer.height * (1.2 + Math.random() * 1.6); // Much taller segments
        const xOffset = (totalWidth / segmentCount) * i - (segmentWidth * 0.3); // More overlap for coverage
        const yOffset = (Math.random() - 0.5) * (layer.height * 0.5); // More vertical variation
        
        segment.style.cssText = `
            position: absolute;
            left: ${xOffset}px;
            top: ${yOffset}px;
            width: ${segmentWidth}px;
            height: ${segmentHeight}px;
            background: radial-gradient(ellipse ${segmentWidth/2}px ${segmentHeight/2}px at center, 
                ${fogColor} 0%, 
                ${fogColor} 40%, 
                transparent 70%);
            border-radius: ${segmentWidth/2}px ${segmentHeight/2}px;
            opacity: ${0.7 + Math.random() * 0.6}; // Varied opacity per segment
        `;
        
        fogLayer.appendChild(segment);
    }

    fogContainer.appendChild(fogLayer);

    // Wind-affected movement - fog responds to wind speed
    const windEffect = settings.windSpeed * (0.5 + Math.random() * 0.5); // 50-100% wind effect
    const baseDuration = 15 / layer.speed; // Base duration for movement
    const windAdjustedDuration = Math.max(8, baseDuration / windEffect); // Wind speeds up fog

    // Calculate proper start and end positions to ensure smooth animation
    const fogLayerWidth = cardWidth * layer.scale;
    const startX = -fogLayerWidth; // Start completely off-screen left
    const endX = cardWidth + fogLayerWidth; // End completely off-screen right
    
    // Set initial position
    window.AnimatedWeatherCardGsap.set(fogLayer, {
        x: startX,
        opacity: layer.opacity
    });

    // Create infinite horizontal drift animation
    const tl = window.AnimatedWeatherCardGsap.timeline({
        repeat: -1,
        delay: layerIndex * 2 + Math.random() * 3 // Stagger start times
    });

    // Animate fog layer across screen - from completely off-screen to completely off-screen
    tl.to(fogLayer, {
        x: endX,
        duration: windAdjustedDuration,
        ease: "none",
        onComplete: () => {
            // Reset position for seamless loop
            window.AnimatedWeatherCardGsap.set(fogLayer, { x: startX });
        }
    });

    // Add subtle opacity variation to simulate fog density changes
    const opacityTl = window.AnimatedWeatherCardGsap.timeline({ repeat: -1, yoyo: true });
    opacityTl.to(fogLayer, {
        opacity: layer.opacity * 0.6,
        duration: 3 + Math.random() * 4,
        ease: "sine.inOut"
    });

    return { movement: tl, opacity: opacityTl };
}

/**
 * Clear fog layers when weather changes
 */
export function clearFogLayers(cardElement: HTMLElement) {
    const fogLayers = cardElement.querySelectorAll('.fog-layer');
    fogLayers.forEach(layer => {
        if (layer.parentNode) {
            layer.parentNode.removeChild(layer);
        }
    });
}
