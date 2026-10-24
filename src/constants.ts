// Constants and default values for Animated Weather Card

import { AnimatedWeatherCardConfig } from './types';

export const DEFAULT_CONFIG: AnimatedWeatherCardConfig = {
    entity: "weather.forecast_home",
    name: "Weather",
    outdoor_sensor_entity: "",
    humidity_sensor_entity: "",
    pressure_sensor_entity: "",
    show_attributes: true,
    show_location: true,
    animate: true,
    auto_pause: false,
    dev_mode: false,
    disable_lightning_shake: false,
    color_palette: "default", // default | theme
    // Day/night cycle defaults
    enable_day_night_cycle: false, // Disabled by default for backward compatibility
    sunrise_hour: 6,
    sunset_hour: 20
};

export const DEFAULT_ENGINE_SETTINGS = {
    windSpeed: 2,
    rainCount: 1,
    leafCount: 1,
    snowCount: 1,
    cloudBaseSize: 1,
    cloudCount: 3,
    splashBounce: 80
};

export const DEV_MODE_TEMPERATURES = {
    'sunny': '26',
    'rainy': '18',
    'snowy': '2',
    'stormy': '16',
    'windy': '20',
    'cloudy': '15',
    'foggy': '12',
    'partly-cloudy': '23',
    'pouring': '14',
    'snowy-rainy': '3',
    'clear-night': '8',
    'sleety': '1',
    'snowy-stormy': '0',
    'light-rain': '20',
    'sleety-stormy': '-1'
};

export const DEV_MODE_CONDITION_NAMES = {
    'sunny': 'Sunny',
    'rainy': 'Rainy',
    'snowy': 'Snowy',
    'stormy': 'Thunderstorm',
    'windy': 'Windy',
    'cloudy': 'Cloudy',
    'foggy': 'Foggy',
    'partly-cloudy': 'Partly Cloudy',
    'pouring': 'Pouring Rain',
    'snowy-rainy': 'Mixed Precipitation',
    'clear-night': 'Clear Night',
    'sleety': 'Sleet',
    'snowy-stormy': 'Snowy Thunderstorm',
    'light-rain': 'Light Rain',
    'sleety-stormy': 'Sleet Storm'
};

// Performance thresholds for metrics color coding
export const PERFORMANCE_THRESHOLDS = {
    PARTICLES: {
        GOOD: 100,
        WARNING: 300
    },
    ANIMATIONS: {
        GOOD: 3,
        WARNING: 6
    },
    FRAME_RATE: {
        GOOD: 45,
        WARNING: 24
    },
    MEMORY: {
        GOOD: 10240, // 10MB in KB
        WARNING: 51200 // 50MB in KB
    }
};

// Dev panel configuration
export const DEV_PANEL_CONFIG = {
    METRICS_REFRESH_INTERVAL: 2000, // 2 seconds
    METRICS_INITIAL_DELAY: 100, // Initial update delay
    Z_INDEX: 10000, // Ensure dev panel is always on top
    MAX_HEIGHT: '80vh',
    MAX_WIDTH: '300px'
};

// Animation timing constants

// Time of day thresholds
export const TIME_THRESHOLDS = {
    DAWN_START: 5,
    DAY_START: 7,
    DUSK_START: 19,
    NIGHT_START: 21,
    UPDATE_INTERVAL: 300000 // 5 minutes in milliseconds
};

export const DEV_MODE_SAMPLE_DATA = {
    humidity: "65%",
    windSpeed: "10 km/h",
    pressure: "1013 hPa",
    indoorTemperature: "22°",
    indoorHumidity: "45%"
};

export const GSAP_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';

export const CARD_VERSION = '1.0.1';

// Day/Night color schemes for animations
export const DAY_NIGHT_ANIMATION_COLORS = {
    // Rain reads as falling light against the sky, not as a color
    rain: {
        day: 'rgba(222, 234, 255, 0.62)',
        night: 'rgba(180, 198, 230, 0.48)',
        dawn: 'rgba(255, 232, 226, 0.58)',
        dusk: 'rgba(255, 220, 200, 0.55)'
    },
    snow: {
        day: '#FFFFFF',      // Pure white
        night: '#B8D4F0',    // Silvery blue
        dawn: '#E6F3FF',     // Very light blue
        dusk: '#D1E7FF'      // Soft blue
    },
    // Also the storm-rain color, so translucent rather than solid
    lightning: {
        day: 'rgba(236, 242, 255, 0.6)',
        night: 'rgba(170, 200, 255, 0.55)',
        dawn: 'rgba(240, 246, 255, 0.58)',
        dusk: 'rgba(214, 230, 255, 0.56)'
    },
    wind: {
        day: '#8FBC8F',      // Light green (leaves)
        night: '#4A5D4A',    // Dark green
        dawn: '#A8CCA8',     // Light green
        dusk: '#6B8F6B'      // Medium green
    },
    clouds: {
        day: '#FFFFFF',      // White clouds
        night: '#737B8C',    // Dark gray clouds
        dawn: '#E8F0F8',     // Light blue-white
        dusk: '#B0B8C8'      // Blue-gray
    },
    fog: {
        day: '#E0E8F0',      // Light gray
        night: '#5A6B7D',    // Dark blue-gray
        dawn: '#D8E4F0',     // Light blue-gray
        dusk: '#8A9BAD'      // Medium blue-gray
    },
    sun: {
        day: '#FFD700',      // Golden yellow
        night: '#FFD700',    // Same (sun doesn't appear at night)
        dawn: '#FFF4B8',     // Pale yellow
        dusk: '#FFE066'      // Warm yellow
    },
    stars: {
        day: '#FFFFFF',      // White (not visible in day)
        night: '#FFFFFF',    // Bright white
        dawn: '#F0F8FF',     // Very faint
        dusk: '#E8F0FF'      // Faint blue-white
    }
};


