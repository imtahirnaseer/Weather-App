// Ultra-Realistic Weather App - Advanced 3D Experience

class UltraRealisticWeatherApp {
    constructor() {
        this.API_KEY = 'ce46629bee824337ba6144123250407';
        this.BASE_URL = 'https://api.weatherapi.com/v1';
        this.currentWeather = null;
        this.forecast = null;
        this.loading = false;
        this.error = null;
        this.isNightMode = false;
        this.temperatureUnit = 'celsius';
        this.weatherEffectsActive = false;
        this.sceneAnimations = new Map();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeScene();
        this.showLoadingScreen();
        
        // Initialize with default location after loading screen
        setTimeout(() => {
            this.hideLoadingScreen();
            this.searchLocation('New York');
            this.updateSceneBasedOnTime();
            this.startAtmosphericAnimations();
        }, 4000);
    }

    initializeScene() {
        // Set initial scene based on current time
        const currentHour = new Date().getHours();
        this.isNightMode = currentHour < 6 || currentHour > 18;
        this.updateScene();
        this.initializeShootingStars();
        this.initializeParticleSystem();
    }

    updateSceneBasedOnTime() {
        if (this.currentWeather) {
            const localTime = new Date(this.currentWeather.location.localtime);
            const hour = localTime.getHours();
            const shouldBeNight = hour < 6 || hour > 18;
            
            if (shouldBeNight !== this.isNightMode) {
                this.isNightMode = shouldBeNight;
                this.updateScene();
            }
        }
    }

    updateScene() {
        const scene3d = document.getElementById('scene-3d');
        const sunSystem = document.getElementById('sun-system');
        const moonSystem = document.getElementById('moon-system');
        const starField = document.getElementById('star-field');
        const skyGradient = document.getElementById('sky-gradient');
        const buildingWindows = document.getElementById('building-windows');
        const lightRays = document.getElementById('light-rays');
        const dayNightToggle = document.getElementById('day-night-toggle');
        const unitDisplay = document.getElementById('unit-display');
        
        // Get all elements that need night mode styling
        const headerGlass = document.querySelector('.header-glass');
        const searchGlassCard = document.querySelector('.search-glass-card');
        const weatherCards = document.querySelectorAll('.weather-card-3d');
        const appTitle = document.querySelector('.app-title-3d');
        const appSubtitle = document.querySelector('.app-subtitle-3d');
        const terrainGrass = document.querySelector('.terrain-grass');
        const leafClusters = document.querySelectorAll('.leaf-cluster');
        
        if (this.isNightMode) {
            // Night mode
            scene3d.classList.add('night');
            skyGradient.classList.add('night');
            starField.classList.add('night');
            sunSystem.classList.add('night');
            moonSystem.classList.add('night');
            buildingWindows.classList.add('night');
            lightRays.classList.remove('day');
            dayNightToggle.classList.add('night');
            
            // UI Elements
            headerGlass.classList.add('night');
            searchGlassCard.classList.add('night');
            weatherCards.forEach(card => card.classList.add('night'));
            appTitle.classList.add('night');
            appSubtitle.classList.add('night');
            terrainGrass.classList.add('night');
            leafClusters.forEach(cluster => cluster.classList.add('night'));
            
            // Update temperature unit for night mode
            this.temperatureUnit = 'fahrenheit';
            unitDisplay.textContent = '°F';
        } else {
            // Day mode
            scene3d.classList.remove('night');
            skyGradient.classList.remove('night');
            starField.classList.remove('night');
            sunSystem.classList.remove('night');
            moonSystem.classList.remove('night');
            buildingWindows.classList.remove('night');
            lightRays.classList.add('day');
            dayNightToggle.classList.remove('night');
            
            // UI Elements
            headerGlass.classList.remove('night');
            searchGlassCard.classList.remove('night');
            weatherCards.forEach(card => card.classList.remove('night'));
            appTitle.classList.remove('night');
            appSubtitle.classList.remove('night');
            terrainGrass.classList.remove('night');
            leafClusters.forEach(cluster => cluster.classList.remove('night'));
            
            // Update temperature unit for day mode
            this.temperatureUnit = 'celsius';
            unitDisplay.textContent = '°C';
        }
        
        // Re-render weather data with new temperature unit
        if (this.currentWeather && this.forecast) {
            this.renderWeatherData();
        }
    }

    updateWeatherEffects(condition) {
        const rainSystem = document.getElementById('rain-system');
        const snowSystem = document.getElementById('snow-system');
        const lightningSystem = document.getElementById('lightning-system');
        const fogSystem = document.getElementById('fog-system');
        
        // Reset all effects
        rainSystem.classList.remove('active');
        snowSystem.classList.remove('active');
        lightningSystem.classList.remove('active');
        fogSystem.classList.remove('active');
        
        const conditionLower = condition.toLowerCase();
        
        if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
            rainSystem.classList.add('active');
            this.weatherEffectsActive = true;
        } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
            snowSystem.classList.add('active');
            this.weatherEffectsActive = true;
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            lightningSystem.classList.add('active');
            rainSystem.classList.add('active');
            this.weatherEffectsActive = true;
        } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            fogSystem.classList.add('active');
            this.weatherEffectsActive = true;
        } else {
            this.weatherEffectsActive = false;
        }
    }

    initializeShootingStars() {
        const starField = document.getElementById('star-field');
        
        const createShootingStar = () => {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: linear-gradient(45deg, #ffffff, transparent);
                border-radius: 50%;
                top: ${Math.random() * 40}%;
                left: ${Math.random() * 100}%;
                opacity: 0;
                animation: shooting-star-trail 2s linear forwards;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            `;
            
            starField.appendChild(shootingStar);
            
            setTimeout(() => {
                shootingStar.remove();
            }, 2000);
        };
        
        // Create shooting stars periodically during night mode
        setInterval(() => {
            if (this.isNightMode && Math.random() < 0.3) {
                createShootingStar();
            }
        }, 8000);
        
        // Add shooting star animation to CSS
        if (!document.getElementById('shooting-star-styles')) {
            const style = document.createElement('style');
            style.id = 'shooting-star-styles';
            style.textContent = `
                @keyframes shooting-star-trail {
                    0% {
                        transform: translateX(0) translateY(0) scale(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(400px) translateY(400px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initializeParticleSystem() {
        const particleSystem = document.getElementById('particle-system');
        
        // Create floating dust particles
        const createDustParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'floating-dust';
            particle.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: dust-float-extended 15s ease-in-out infinite;
                animation-delay: ${Math.random() * 15}s;
                pointer-events: none;
            `;
            
            particleSystem.appendChild(particle);
        };
        
        // Create multiple dust particles
        for (let i = 0; i < 20; i++) {
            createDustParticle();
        }
        
        // Add extended dust animation
        if (!document.getElementById('dust-styles')) {
            const style = document.createElement('style');
            style.id = 'dust-styles';
            style.textContent = `
                @keyframes dust-float-extended {
                    0%, 100% { 
                        transform: translateY(0) translateX(0) scale(1); 
                        opacity: 0.4; 
                    }
                    25% { 
                        transform: translateY(-50px) translateX(20px) scale(1.2); 
                        opacity: 0.8; 
                    }
                    50% { 
                        transform: translateY(-30px) translateX(-15px) scale(0.8); 
                        opacity: 1; 
                    }
                    75% { 
                        transform: translateY(-70px) translateX(30px) scale(1.1); 
                        opacity: 0.6; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    startAtmosphericAnimations() {
        // Animate volumetric clouds
        const clouds = document.querySelectorAll('.volumetric-cloud');
        clouds.forEach((cloud, index) => {
            const animationId = setInterval(() => {
                const currentOpacity = parseFloat(getComputedStyle(cloud).opacity);
                const newOpacity = 0.3 + Math.random() * 0.5;
                cloud.style.opacity = newOpacity;
            }, 3000 + index * 1000);
            
            this.sceneAnimations.set(`cloud-${index}`, animationId);
        });
        
        // Animate building windows
        const windows = document.querySelectorAll('.window');
        windows.forEach((window, index) => {
            const animationId = setInterval(() => {
                if (this.isNightMode) {
                    const shouldFlicker = Math.random() < 0.3;
                    if (shouldFlicker) {
                        window.style.opacity = Math.random() * 0.8 + 0.2;
                    }
                }
            }, 2000 + index * 500);
            
            this.sceneAnimations.set(`window-${index}`, animationId);
        });
    }

    bindEvents() {
        const searchForm = document.getElementById('search-form');
        const locationBtn = document.getElementById('location-btn');
        const errorRetryBtn = document.getElementById('error-retry-btn');
        const dayNightToggle = document.getElementById('day-night-toggle');
        const tempUnitToggle = document.getElementById('temp-unit-toggle');

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            const location = searchInput.value.trim();
            if (location) {
                this.searchLocation(location);
                searchInput.value = '';
            }
        });

        locationBtn.addEventListener('click', () => {
            this.getCurrentLocationWeather();
        });

        errorRetryBtn.addEventListener('click', () => {
            this.hideError();
            this.searchLocation('New York');
        });

        dayNightToggle.addEventListener('click', () => {
            this.isNightMode = !this.isNightMode;
            this.updateScene();
        });

        tempUnitToggle.addEventListener('click', () => {
            this.temperatureUnit = this.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
            document.getElementById('unit-display').textContent = this.temperatureUnit === 'celsius' ? '°C' : '°F';
            
            if (this.currentWeather && this.forecast) {
                this.renderWeatherData();
            }
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        loadingScreen.classList.remove('hidden');
        app.classList.add('hidden');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        // Fade out loading screen
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 1s ease-out';
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            app.classList.remove('hidden');
            
            // Fade in app
            app.style.opacity = '0';
            app.style.transition = 'opacity 1s ease-in';
            setTimeout(() => {
                app.style.opacity = '1';
            }, 100);
        }, 1000);
    }

    setLoading(isLoading) {
        this.loading = isLoading;
        const searchBtn = document.getElementById('search-btn');
        const locationBtn = document.getElementById('location-btn');
        
        if (isLoading) {
            searchBtn.disabled = true;
            locationBtn.disabled = true;
            searchBtn.classList.add('loading');
            locationBtn.classList.add('loading');
        } else {
            searchBtn.disabled = false;
            locationBtn.disabled = false;
            searchBtn.classList.remove('loading');
            locationBtn.classList.remove('loading');
        }
    }

    showError(message) {
        this.error = message;
        const errorElement = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        errorText.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Hide weather content
        document.getElementById('current-weather').innerHTML = '';
        document.getElementById('forecast').innerHTML = '';
        document.getElementById('weather-details').innerHTML = '';
    }

    hideError() {
        this.error = null;
        const errorElement = document.getElementById('error-message');
        errorElement.classList.add('hidden');
    }

    async searchLocation(location) {
        this.setLoading(true);
        this.hideError();
        
        try {
            const [weatherData, forecastData] = await Promise.all([
                this.getCurrentWeather(location),
                this.getForecast(location)
            ]);
            
            this.currentWeather = weatherData;
            this.forecast = forecastData;
            this.renderWeatherData();
            this.updateSceneBasedOnTime();
            this.updateWeatherEffects(weatherData.current.condition.text);
        } catch (error) {
            this.showError('Failed to fetch weather data. Please check your connection and try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async getCurrentLocationWeather() {
        this.setLoading(true);
        this.hideError();
        
        try {
            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            
            const [weatherData, forecastData] = await Promise.all([
                this.getCurrentWeatherByCoords(latitude, longitude),
                this.getForecastByCoords(latitude, longitude)
            ]);
            
            this.currentWeather = weatherData;
            this.forecast = forecastData;
            this.renderWeatherData();
            this.updateSceneBasedOnTime();
            this.updateWeatherEffects(weatherData.current.condition.text);
        } catch (error) {
            this.showError('Failed to get your location. Please enable location services or search manually.');
        } finally {
            this.setLoading(false);
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: true
            });
        });
    }

    async getCurrentWeather(location) {
        const response = await fetch(
            `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch current weather');
        }
        
        return await response.json();
    }

    async getCurrentWeatherByCoords(lat, lon) {
        const response = await fetch(
            `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${lat},${lon}&aqi=yes`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch current weather');
        }
        
        return await response.json();
    }

    async getForecast(location, days = 5) {
        const response = await fetch(
            `${this.BASE_URL}/forecast.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&days=${days}&aqi=yes&alerts=yes`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }
        
        return await response.json();
    }

    async getForecastByCoords(lat, lon, days = 5) {
        const response = await fetch(
            `${this.BASE_URL}/forecast.json?key=${this.API_KEY}&q=${lat},${lon}&days=${days}&aqi=yes&alerts=yes`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }
        
        return await response.json();
    }

    getTemperature(tempC, tempF = null) {
        if (this.temperatureUnit === 'fahrenheit') {
            return tempF !== null ? Math.round(tempF) : Math.round((tempC * 9/5) + 32);
        }
        return Math.round(tempC);
    }

    getTemperatureUnit() {
        return this.temperatureUnit === 'celsius' ? '°C' : '°F';
    }

    renderWeatherData() {
        if (!this.currentWeather || !this.forecast) return;
        
        this.renderCurrentWeather();
        this.renderForecast();
        this.renderWeatherDetails();
    }

    renderCurrentWeather() {
        const container = document.getElementById('current-weather');
        const weather = this.currentWeather;
        
        container.innerHTML = `
            <div class="current-weather-content">
                <div class="weather-header-3d">
                    <div class="location-info-3d">
                        <div class="location-icon-3d">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                        </div>
                        <div class="location-details-3d">
                            <h2 class="location-name-3d">${weather.location.name}</h2>
                            <p class="location-region-3d">${weather.location.region}, ${weather.location.country}</p>
                        </div>
                    </div>
                    <div class="weather-time-3d">
                        <div class="time-display">${new Date(weather.location.localtime).toLocaleTimeString()}</div>
                        <div class="date-display">${new Date(weather.location.localtime).toLocaleDateString()}</div>
                    </div>
                </div>

                <div class="weather-main-display-3d">
                    <div class="weather-visual-3d">
                        <div class="weather-icon-3d">
                            ${this.getWeatherIcon3D(weather.current.condition.text, weather.current.is_day === 1)}
                        </div>
                        <div class="temperature-display-3d">
                            <span class="temp-value">${this.getTemperature(weather.current.temp_c, weather.current.temp_f)}</span>
                            <span class="temp-unit">${this.getTemperatureUnit()}</span>
                        </div>
                    </div>
                    
                    <div class="weather-info-3d">
                        <h3 class="condition-text-3d">${weather.current.condition.text}</h3>
                        <p class="feels-like-3d">Feels like ${this.getTemperature(weather.current.feelslike_c, weather.current.feelslike_f)}${this.getTemperatureUnit()}</p>
                        
                        <div class="weather-stats-grid-3d">
                            <div class="stat-item-3d">
                                <div class="stat-icon-3d">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                                        <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                                        <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                                    </svg>
                                </div>
                                <div class="stat-content-3d">
                                    <span class="stat-label-3d">Wind</span>
                                    <span class="stat-value-3d">${weather.current.wind_kph} km/h</span>
                                </div>
                            </div>
                            
                            <div class="stat-item-3d">
                                <div class="stat-icon-3d">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                                    </svg>
                                </div>
                                <div class="stat-content-3d">
                                    <span class="stat-label-3d">Humidity</span>
                                    <span class="stat-value-3d">${weather.current.humidity}%</span>
                                </div>
                            </div>
                            
                            <div class="stat-item-3d">
                                <div class="stat-icon-3d">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </div>
                                <div class="stat-content-3d">
                                    <span class="stat-label-3d">Visibility</span>
                                    <span class="stat-value-3d">${weather.current.vis_km} km</span>
                                </div>
                            </div>
                            
                            <div class="stat-item-3d">
                                <div class="stat-icon-3d">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="5"/>
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                                    </svg>
                                </div>
                                <div class="stat-content-3d">
                                    <span class="stat-label-3d">UV Index</span>
                                    <span class="stat-value-3d">${weather.current.uv}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderForecast() {
        const container = document.getElementById('forecast');
        const forecast = this.forecast;
        
        const forecastDays = forecast.forecast.forecastday.map((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return `
                <div class="forecast-day-3d ${index === 0 ? 'today' : ''}">
                    <div class="forecast-day-header-3d">
                        <h4 class="day-name-3d">${dayName}</h4>
                        <p class="day-date-3d">${dateStr}</p>
                    </div>
                    
                    <div class="forecast-icon-3d">
                        ${this.getWeatherIcon3D(day.day.condition.text, true, 'small')}
                    </div>
                    
                    <div class="forecast-temps-3d">
                        <div class="temp-high-3d">
                            <span class="temp-label">High</span>
                            <span class="temp-value">${this.getTemperature(day.day.maxtemp_c, day.day.maxtemp_f)}°</span>
                        </div>
                        <div class="temp-low-3d">
                            <span class="temp-label">Low</span>
                            <span class="temp-value">${this.getTemperature(day.day.mintemp_c, day.day.mintemp_f)}°</span>
                        </div>
                    </div>
                    
                    <p class="forecast-condition-3d">${day.day.condition.text}</p>
                    
                    <div class="forecast-details-3d">
                        <div class="detail-item">
                            <span class="detail-icon">💧</span>
                            <span class="detail-value">${day.day.daily_chance_of_rain}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">💨</span>
                            <span class="detail-value">${Math.round(day.day.maxwind_kph)} km/h</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = `
            <div class="forecast-content-3d">
                <div class="forecast-header-3d">
                    <div class="forecast-title-icon-3d">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                    <h3 class="forecast-title-3d">5-Day Forecast</h3>
                </div>
                <div class="forecast-grid-3d">
                    ${forecastDays}
                </div>
            </div>
        `;
    }

    renderWeatherDetails() {
        const container = document.getElementById('weather-details');
        const weather = this.currentWeather;
        const todayForecast = this.forecast.forecast.forecastday[0];
        
        const details = [
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                </svg>`,
                label: 'Real Feel',
                value: `${this.getTemperature(weather.current.feelslike_c, weather.current.feelslike_f)}${this.getTemperatureUnit()}`,
                color: '#ef4444'
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                </svg>`,
                label: 'Pressure',
                value: `${weather.current.pressure_mb} mb`,
                color: '#3b82f6'
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                </svg>`,
                label: 'Wind Speed',
                value: `${weather.current.wind_kph} km/h`,
                color: '#10b981'
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>`,
                label: 'Humidity',
                value: `${weather.current.humidity}%`,
                color: '#06b6d4'
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 18a5 5 0 0 0-10 0"/>
                    <line x1="12" y1="2" x2="12" y2="9"/>
                    <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
                    <line x1="1" y1="18" x2="3" y2="18"/>
                    <line x1="21" y1="18" x2="23" y2="18"/>
                    <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
                    <line x1="23" y1="22" x2="1" y2="22"/>
                    <polyline points="8,6 12,2 16,6"/>
                </svg>`,
                label: 'Sunrise',
                value: todayForecast.astro.sunrise,
                color: '#fbbf24'
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 18a5 5 0 0 0-10 0"/>
                    <line x1="12" y1="9" x2="12" y2="2"/>
                    <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
                    <line x1="1" y1="18" x2="3" y2="18"/>
                    <line x1="21" y1="18" x2="23" y2="18"/>
                    <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
                    <line x1="23" y1="22" x2="1" y2="22"/>
                    <polyline points="16,5 12,9 8,5"/>
                </svg>`,
                label: 'Sunset',
                value: todayForecast.astro.sunset,
                color: '#f59e0b'
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>`,
                label: 'UV Index',
                value: weather.current.uv.toString(),
                color: '#9333ea'
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>`,
                label: 'Moon Phase',
                value: todayForecast.astro.moon_phase,
                color: '#6366f1'
            }
        ];
        
        const detailsHTML = details.map(detail => `
            <div class="detail-item-3d">
                <div class="detail-icon-3d" style="color: ${detail.color}">
                    ${detail.icon}
                </div>
                <div class="detail-content-3d">
                    <span class="detail-label-3d">${detail.label}</span>
                    <span class="detail-value-3d">${detail.value}</span>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="details-content-3d">
                <div class="details-header-3d">
                    <h3 class="details-title-3d">Weather Details</h3>
                </div>
                <div class="details-grid-3d">
                    ${detailsHTML}
                </div>
                
                ${weather.current.air_quality ? `
                    <div class="air-quality-3d">
                        <h4 class="air-quality-title-3d">Air Quality</h4>
                        <div class="air-quality-grid-3d">
                            <div class="air-quality-item-3d">
                                <span class="aqi-label">CO</span>
                                <span class="aqi-value">${Math.round(weather.current.air_quality.co)}</span>
                            </div>
                            <div class="air-quality-item-3d">
                                <span class="aqi-label">NO₂</span>
                                <span class="aqi-value">${Math.round(weather.current.air_quality.no2)}</span>
                            </div>
                            <div class="air-quality-item-3d">
                                <span class="aqi-label">O₃</span>
                                <span class="aqi-value">${Math.round(weather.current.air_quality.o3)}</span>
                            </div>
                            <div class="air-quality-item-3d">
                                <span class="aqi-label">PM2.5</span>
                                <span class="aqi-value">${Math.round(weather.current.air_quality.pm2_5)}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getWeatherIcon3D(condition, isDay, size = 'large') {
        const conditionLower = condition.toLowerCase();
        let iconClass = `weather-icon-3d-${size}`;
        let iconColor = isDay ? '#fbbf24' : '#e2e8f0';
        let iconSVG = '';
        
        if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
            if (isDay) {
                iconSVG = `
                    <div class="${iconClass} sun-icon-3d">
                        <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                            <circle cx="12" cy="12" r="5"/>
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                        </svg>
                        <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                    </div>
                `;
            } else {
                iconSVG = `
                    <div class="${iconClass} moon-icon-3d">
                        <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                        <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                    </div>
                `;
            }
        } else if (conditionLower.includes('partly cloudy')) {
            iconColor = '#94a3b8';
            iconSVG = `
                <div class="${iconClass} partly-cloudy-icon-3d">
                    <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                        <circle cx="12" cy="12" r="3" stroke="#fbbf24"/>
                    </svg>
                    <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                </div>
            `;
        } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
            iconColor = '#6b7280';
            iconSVG = `
                <div class="${iconClass} cloudy-icon-3d">
                    <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                    </svg>
                    <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                </div>
            `;
        } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
            iconColor = '#3b82f6';
            iconSVG = `
                <div class="${iconClass} rain-icon-3d">
                    <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                        <path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
                    </svg>
                    <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                </div>
            `;
        } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
            iconColor = '#e2e8f0';
            iconSVG = `
                <div class="${iconClass} snow-icon-3d">
                    <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
                        <line x1="8" y1="16" x2="8.01" y2="16"/>
                        <line x1="8" y1="20" x2="8.01" y2="20"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                        <line x1="12" y1="22" x2="12.01" y2="22"/>
                        <line x1="16" y1="16" x2="16.01" y2="16"/>
                        <line x1="16" y1="20" x2="16.01" y2="20"/>
                    </svg>
                    <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                </div>
            `;
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            iconColor = '#8b5cf6';
            iconSVG = `
                <div class="${iconClass} thunder-icon-3d">
                    <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
                        <polyline points="13 11 9 17 15 17 11 23"/>
                    </svg>
                    <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                </div>
            `;
        } else {
            // Default cloud icon
            iconColor = '#6b7280';
            iconSVG = `
                <div class="${iconClass} default-icon-3d">
                    <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                    </svg>
                    <div class="icon-glow" style="background: radial-gradient(circle, ${iconColor}33 0%, transparent 70%);"></div>
                </div>
            `;
        }
        
        return iconSVG;
    }

    // Cleanup method
    destroy() {
        // Clear all animations
        this.sceneAnimations.forEach((animationId) => {
            clearInterval(animationId);
        });
        this.sceneAnimations.clear();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UltraRealisticWeatherApp();
});

// Add dynamic 3D icon styles
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('weather-icon-3d-styles')) {
        const style = document.createElement('style');
        style.id = 'weather-icon-3d-styles';
        style.textContent = `
            .weather-icon-3d-large {
                position: relative;
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: icon-float 4s ease-in-out infinite;
            }
            
            .weather-icon-3d-small {
                position: relative;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: icon-float 4s ease-in-out infinite;
            }
            
            .weather-icon-3d-large svg {
                width: 60px;
                height: 60px;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
            }
            
            .weather-icon-3d-small svg {
                width: 30px;
                height: 30px;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            }
            
            .icon-glow {
                position: absolute;
                top: -20%;
                left: -20%;
                width: 140%;
                height: 140%;
                border-radius: 50%;
                animation: icon-glow-pulse 3s ease-in-out infinite;
                pointer-events: none;
            }
            
            .sun-icon-3d .icon-glow {
                animation: sun-icon-glow 2s ease-in-out infinite;
            }
            
            .rain-icon-3d svg {
                animation: rain-icon-shake 0.5s ease-in-out infinite;
            }
            
            .snow-icon-3d svg {
                animation: snow-icon-drift 3s ease-in-out infinite;
            }
            
            .thunder-icon-3d svg {
                animation: thunder-icon-flash 2s ease-in-out infinite;
            }
            
            @keyframes icon-float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes icon-glow-pulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.1); }
            }
            
            @keyframes sun-icon-glow {
                0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
                50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
            }
            
            @keyframes rain-icon-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-1px); }
                75% { transform: translateX(1px); }
            }
            
            @keyframes snow-icon-drift {
                0%, 100% { transform: translateX(0) rotate(0deg); }
                33% { transform: translateX(2px) rotate(120deg); }
                66% { transform: translateX(-2px) rotate(240deg); }
            }
            
            @keyframes thunder-icon-flash {
                0%, 90%, 100% { opacity: 1; }
                95% { opacity: 0.3; }
            }
            
            /* Weather content styling */
            .current-weather-content {
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            
            .weather-header-3d {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            
            .location-info-3d {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .location-icon-3d {
                width: 24px;
                height: 24px;
                color: #3b82f6;
                animation: pulse 2s ease-in-out infinite;
            }
            
            .location-name-3d {
                font-size: 1.8rem;
                font-weight: 700;
                color: white;
                margin-bottom: 0.25rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .location-region-3d {
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .weather-time-3d {
                text-align: right;
                color: rgba(255, 255, 255, 0.6);
            }
            
            .time-display {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .date-display {
                font-size: 0.9rem;
            }
            
            .weather-main-display-3d {
                display: flex;
                align-items: center;
                gap: 3rem;
            }
            
            .weather-visual-3d {
                display: flex;
                align-items: center;
                gap: 2rem;
            }
            
            .temperature-display-3d {
                display: flex;
                align-items: baseline;
                gap: 0.5rem;
            }
            
            .temp-value {
                font-size: 4rem;
                font-weight: 900;
                background: linear-gradient(135deg, #60a5fa, #3b82f6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
            }
            
            .temp-unit {
                font-size: 2rem;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .weather-info-3d {
                flex: 1;
            }
            
            .condition-text-3d {
                font-size: 1.5rem;
                font-weight: 600;
                color: white;
                margin-bottom: 0.5rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .feels-like-3d {
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 2rem;
            }
            
            .weather-stats-grid-3d {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            
            .stat-item-3d {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            }
            
            .stat-item-3d:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-2px);
            }
            
            .stat-icon-3d {
                width: 20px;
                height: 20px;
                color: #60a5fa;
            }
            
            .stat-content-3d {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .stat-label-3d {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.6);
                font-weight: 500;
            }
            
            .stat-value-3d {
                font-size: 1rem;
                color: white;
                font-weight: 600;
            }
            
            /* Forecast styling */
            .forecast-content-3d {
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            
            .forecast-header-3d {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .forecast-title-icon-3d {
                width: 24px;
                height: 24px;
                color: #10b981;
            }
            
            .forecast-title-3d {
                font-size: 1.5rem;
                font-weight: 700;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .forecast-grid-3d {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .forecast-day-3d {
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .forecast-day-3d:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-3px);
            }
            
            .forecast-day-3d.today {
                background: rgba(59, 130, 246, 0.2);
                border: 2px solid rgba(59, 130, 246, 0.4);
            }
            
            .forecast-day-header-3d {
                margin-bottom: 1rem;
            }
            
            .day-name-3d {
                font-size: 1rem;
                font-weight: 600;
                color: white;
                margin-bottom: 0.25rem;
            }
            
            .day-date-3d {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.6);
            }
            
            .forecast-icon-3d {
                margin-bottom: 1rem;
                display: flex;
                justify-content: center;
            }
            
            .forecast-temps-3d {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
            }
            
            .temp-high-3d, .temp-low-3d {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .temp-high-3d .temp-label {
                font-size: 0.7rem;
                color: rgba(255, 255, 255, 0.6);
                text-transform: uppercase;
                font-weight: 500;
            }
            
            .temp-high-3d .temp-value {
                font-size: 1.1rem;
                font-weight: 700;
                color: #ef4444;
            }
            
            .temp-low-3d .temp-label {
                font-size: 0.7rem;
                color: rgba(255, 255, 255, 0.6);
                text-transform: uppercase;
                font-weight: 500;
            }
            
            .temp-low-3d .temp-value {
                font-size: 1.1rem;
                font-weight: 700;
                color: #3b82f6;
            }
            
            .forecast-condition-3d {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 1rem;
                line-height: 1.3;
            }
            
            .forecast-details-3d {
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.6);
            }
            
            .forecast-details-3d .detail-item {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            /* Details styling */
            .details-content-3d {
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            
            .details-header-3d {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .details-title-3d {
                font-size: 1.5rem;
                font-weight: 700;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .details-grid-3d {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem;
                flex: 1;
            }
            
            .detail-item-3d {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            }
            
            .detail-item-3d:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-2px);
            }
            
            .detail-icon-3d {
                width: 24px;
                height: 24px;
                flex-shrink: 0;
            }
            
            .detail-content-3d {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            
            .detail-label-3d {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.7);
                font-weight: 500;
            }
            
            .detail-value-3d {
                font-size: 1rem;
                color: white;
                font-weight: 600;
            }
            
            .air-quality-3d {
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .air-quality-title-3d {
                font-size: 1.1rem;
                font-weight: 600;
                color: white;
                margin-bottom: 1rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .air-quality-grid-3d {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
            
            .air-quality-item-3d {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }
            
            .aqi-label {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.7);
                font-weight: 500;
            }
            
            .aqi-value {
                font-size: 0.9rem;
                color: white;
                font-weight: 600;
            }
            
            @media (max-width: 768px) {
                .weather-main-display-3d {
                    flex-direction: column;
                    gap: 2rem;
                    text-align: center;
                }
                
                .weather-stats-grid-3d {
                    grid-template-columns: 1fr;
                }
                
                .forecast-grid-3d {
                    grid-template-columns: 1fr;
                }
                
                .air-quality-grid-3d {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
});