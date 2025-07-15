import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  pinned: boolean;
  cut: boolean;
  active: boolean; // For memory optimization
  floorTime?: number; // Track how long point has been on floor
}

interface Connection {
  p1: Point;
  p2: Point;
  restLength: number;
  active: boolean;
  type: 'structural' | 'shear' | 'bend';
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'bend';
  colorKey?: string; // Cached color key
  strength: number; // Individual connection strength
}

interface FabricNettingProps {
  isActive: boolean;
  onReset?: React.MutableRefObject<{ reset: () => void } | undefined>;
  rainbowMode?: boolean;
}

// Performance constants
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;
const GRID_SIZE = 8; // Smaller grid for more detailed simulation
const DAMPING = 0.99;
const STRUCTURAL_STIFFNESS = 0.95; // Higher stiffness for more realistic cloth
const VERTICAL_STIFFNESS = 0.98; // Even higher stiffness for vertical connections
const GRAVITY = 0.05;
const CUT_RADIUS = 15;
const CONSTRAINT_ITERATIONS = 3; // More iterations for better stability
const MAX_STRETCH = 1.5; // More realistic stretch limit
const TEAR_THRESHOLD = 10.0; // Much higher tear threshold
const MOUSE_INTERACTION_THROTTLE = 2; // Reduced for better responsiveness
const MIN_FPS_THRESHOLD = 30;

// Wind and environmental effects
const AIR_RESISTANCE = 0.015; // Air drag coefficient

// Floor interaction
const FLOOR_HEIGHT = 80; // Distance from bottom where floor effects start
const FLOOR_BOUNCE = 0.3; // Bounce factor when hitting floor
const FLOOR_FRICTION = 0.85; // Friction when sliding on floor
const SETTLING_THRESHOLD = 0.1; // Velocity below which points settle

// Memory optimization constants
const VIEWPORT_BUFFER = 80; // Reduced buffer for better culling
const CLEANUP_INTERVAL = 60; // More frequent cleanup for denser grid
const COLOR_CACHE_SIZE = 1000; // Maximum cached colors
const ADAPTIVE_QUALITY = true; // Enable adaptive quality based on performance

// Pressure sensitivity support
interface PressureState {
  pressure: number;
  tiltX: number;
  tiltY: number;
  supported: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const FabricNetting: React.FC<FabricNettingProps> = ({ isActive, onReset, rainbowMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 });
  const pressureRef = useRef<PressureState>({ pressure: 0.5, tiltX: 0, tiltY: 0, supported: false });
  const [points, setPoints] = useState<Point[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const resetRef = useRef<() => void>();

  // Performance tracking
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const fpsRef = useRef(60);
  const lastCleanupRef = useRef(0);
  
  // Cached calculations
  const colorCacheRef = useRef<Map<string, string>>(new Map());
  const viewportCacheRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const activeConnectionsRef = useRef<Connection[]>([]);
  const visiblePointsRef = useRef<Point[]>([]);
  const adaptiveIterationsRef = useRef(CONSTRAINT_ITERATIONS);
  const performanceMonitorRef = useRef({ frameCount: 0, totalTime: 0, avgFps: 60 });
  const particlesRef = useRef<Particle[]>([]);
  
  // Optimized color calculation with caching
  const getRainbowColor = (x: number, y: number, width: number, height: number): string => {
    if (!rainbowMode) return 'rgba(255, 255, 255, 0.8)';
    
    // Create cache key with higher precision for smoother gradients
    const cacheKey = `${Math.round(x/10)}_${Math.round(y/10)}`;
    
    // Check cache first
    if (colorCacheRef.current.has(cacheKey)) {
      return colorCacheRef.current.get(cacheKey)!;
    }
    
    // Clean cache if it gets too large
    if (colorCacheRef.current.size > COLOR_CACHE_SIZE * 1.5) {
      const entries = Array.from(colorCacheRef.current.entries());
      colorCacheRef.current.clear();
      // Keep most recent 60% of entries
      entries.slice(-Math.floor(COLOR_CACHE_SIZE * 0.6)).forEach(([key, value]) => {
        colorCacheRef.current.set(key, value);
      });
    }
    
    // Calculate more complex rainbow pattern
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    // Create flowing rainbow pattern with time component
    const time = Date.now() * 0.0001; // Slow time progression
    const wave1 = Math.sin(normalizedX * Math.PI * 2 + time) * 0.3;
    const wave2 = Math.cos(normalizedY * Math.PI * 1.5 + time * 0.7) * 0.3;
    
    // Combine position and wave effects for hue
    const baseHue = (normalizedX * 0.4 + normalizedY * 0.4) * 360;
    const waveHue = (wave1 + wave2) * 60; // Wave influence on hue
    const hue = (baseHue + waveHue) % 360;
    
    // Optimized HSL to RGB conversion
    const hslToRgb = (h: number): [number, number, number] => {
      h /= 360;
      // Dynamic saturation and lightness based on position
      const s = 0.7 + (Math.sin(normalizedX * Math.PI + time * 2) * 0.2); // 0.5-0.9
      const l = 0.5 + (Math.cos(normalizedY * Math.PI + time * 1.5) * 0.15); // 0.35-0.65
      
      if (s === 0) return [l * 255, l * 255, l * 255];
      
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      return [
        Math.round(hue2rgb(p, q, h + 1/3) * 255),
        Math.round(hue2rgb(p, q, h) * 255),
        Math.round(hue2rgb(p, q, h - 1/3) * 255)
      ];
    };
    
    const [r, g, b] = hslToRgb(hue);
    
    // Dynamic alpha based on distance from center
    const centerX = width / 2;
    const centerY = height / 2;
    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
    const alpha = 0.6 + (1 - distanceFromCenter / maxDistance) * 0.3; // 0.6-0.9
    
    const color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    
    // Cache the result
    colorCacheRef.current.set(cacheKey, color);
    return color;
  };

  // Viewport culling for memory optimization
  const updateViewport = (canvas: HTMLCanvasElement) => {
    viewportCacheRef.current = {
      width: canvas.width,
      height: canvas.height,
      left: -VIEWPORT_BUFFER,
      top: -VIEWPORT_BUFFER
    };
  };

  // Create particle effect when connection tears
  const createTearParticles = (x: number, y: number, color: string = 'white') => {
    const particleCount = 2 + Math.floor(Math.random() * 2); // 2-3 particles
    
    for (let i = 0; i < particleCount; i++) {
      // More realistic explosion pattern
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
      const speed = 0.3 + Math.random() * 0.5; // Much lower initial velocity
      
      // Add some upward bias to simulate fabric fiber release
      const upwardBias = -0.1 + Math.random() * 0.1;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + upwardBias,
        life: 0.4 + Math.random() * 0.2, // Much shorter lifespan
        maxLife: 0.4 + Math.random() * 0.2,
        size: 0.3 + Math.random() * 0.4, // Much smaller size
        color: rainbowMode ? color : 'rgba(255, 255, 255, 0.8)'
      });
    }
  };

  // Update particles
  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Physics-based forces
      particle.vy += 0.04; // Lighter gravity
      
      // Air resistance (quadratic drag)
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      const dragCoeff = 0.04; // More air resistance
      const drag = dragCoeff * speed;
      
      if (speed > 0) {
        particle.vx -= (particle.vx / speed) * drag;
        particle.vy -= (particle.vy / speed) * drag;
      }
      
      // Bounce off ground with energy loss
      if (particle.y > window.innerHeight - 10) {
        particle.y = window.innerHeight - 10;
        particle.vy *= -0.2; // Even softer bounce
        particle.vx *= 0.9; // More friction
      }
      
      // Bounce off walls with energy loss
      if (particle.x < 0) {
        particle.x = 0;
        particle.vx *= -0.6;
      } else if (particle.x > window.innerWidth) {
        particle.x = window.innerWidth;
        particle.vx *= -0.6;
      }
      
      // Settle particles that are moving very slowly on the ground
      if (particle.y >= window.innerHeight - 11 && Math.abs(particle.vy) < 0.1 && Math.abs(particle.vx) < 0.1) {
        particle.vx *= 0.95;
        particle.vy = 0;
      }
      
      // Update life
      particle.life -= 0.025; // Faster fade for shorter visibility
      
      return particle.life > 0;
    });
  };

  // Render particles
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      // Size changes based on life - starts small, grows, then shrinks
      const lifeProgress = 1 - (particle.life / particle.maxLife);
      let sizeMultiplier;
      if (lifeProgress < 0.3) {
        // Growing phase
        sizeMultiplier = 0.5 + (lifeProgress / 0.3) * 0.5;
      } else {
        // Shrinking phase
        sizeMultiplier = 1.0 - ((lifeProgress - 0.3) / 0.7) * 0.8;
      }
      const size = particle.size * sizeMultiplier;
      
      ctx.save();
      ctx.globalAlpha = alpha * 0.9; // Slightly more transparent
      ctx.fillStyle = particle.color;
      
      // Add slight glow effect for better visibility
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = size * 1;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, Math.max(0.01, size), 0, Math.PI * 2);
      ctx.fill();
      
      // Reset shadow for performance
      ctx.shadowBlur = 0;
      ctx.restore();
    });
  };

  // Check if point is in viewport
  const isPointVisible = (point: Point): boolean => {
    const viewport = viewportCacheRef.current;
    return point.x >= viewport.left - 20 && 
           point.x <= viewport.width + 20 &&
           point.y >= viewport.top - 20 && 
           point.y <= viewport.height + 20;
  };

  // Memory cleanup function
  const cleanupInactiveElements = () => {
    const viewport = viewportCacheRef.current;
    
    // Mark points as active/inactive based on visibility
    points.forEach(point => {
      // More aggressive culling for performance
      point.active = point.x >= viewport.left - 30 && 
                    point.x <= viewport.width + 30 &&
                    point.y >= viewport.top - 30 && 
                    point.y <= viewport.height + 30;
    });

    // Update active connections cache
    activeConnectionsRef.current = connections.filter(conn => {
      // Only keep connections where both points are active
      const bothPointsActive = conn.p1.active && conn.p2.active;
      conn.active = conn.active && bothPointsActive;
      return conn.active;
    });

    // Update visible points cache with spatial optimization
    visiblePointsRef.current = points.filter(point => 
      point.active && !point.cut
    );
  };

  // Performance monitoring and adaptive quality
  const updatePerformanceMetrics = (deltaTime: number) => {
    const monitor = performanceMonitorRef.current;
    monitor.frameCount++;
    monitor.totalTime += deltaTime;
    
    // Calculate average FPS every 60 frames
    if (monitor.frameCount % 60 === 0) {
      monitor.avgFps = 60000 / monitor.totalTime;
      monitor.totalTime = 0;
      
      // Adaptive quality adjustment
      if (ADAPTIVE_QUALITY) {
        if (monitor.avgFps < 50) {
          adaptiveIterationsRef.current = Math.max(1, adaptiveIterationsRef.current - 1);
        } else if (monitor.avgFps > 58) {
          adaptiveIterationsRef.current = Math.min(CONSTRAINT_ITERATIONS, adaptiveIterationsRef.current + 1);
        }
      }
    }
  };

  // Pressure sensitivity detection and handling
  const handlePointerEvent = (e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      pressureRef.current = {
        pressure: e.pressure || 0.5,
        tiltX: e.tiltX || 0,
        tiltY: e.tiltY || 0,
        supported: true
      };
    } else {
      pressureRef.current.pressure = e.pressure || (mouseRef.current.isDown ? 1.0 : 0.5);
    }
    
    mouseRef.current.lastX = mouseRef.current.x;
    mouseRef.current.lastY = mouseRef.current.y;
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable hardware acceleration
    ctx.imageSmoothingEnabled = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateViewport(canvas);
      
      const cols = Math.floor(canvas.width / GRID_SIZE);
      const rows = Math.floor(canvas.height / GRID_SIZE);
      
      const newPoints: Point[] = [];
      const newConnections: Connection[] = [];
      
      // Create 2D array for grid points
      const gridPoints: (Point | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
      
      // Create points
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * GRID_SIZE;
          const y = row * GRID_SIZE;
          
          const point = {
            x,
            y,
            originalX: x,
            originalY: y,
            vx: 0,
            vy: 0,
            pinned: row === 0, // Only pin the very top row
            cut: false,
            active: true
          };
          
          newPoints.push(point);
          gridPoints[row][col] = point;
        }
      }
      
      // Create connections
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const point = gridPoints[row][col];
          if (!point) continue;
          
          // Structural connections (horizontal and vertical)
          if (col < cols - 1) {
            const rightPoint = gridPoints[row][col + 1];
            if (rightPoint) {
              newConnections.push({
                p1: point,
                p2: rightPoint,
                restLength: GRID_SIZE,
                active: true,
                type: 'structural',
                direction: 'horizontal',
                strength: 1.0
              });
            }
          }
          
          if (row < rows - 1) {
            const bottomPoint = gridPoints[row + 1][col];
            if (bottomPoint) {
              newConnections.push({
                p1: point,
                p2: bottomPoint,
                restLength: GRID_SIZE,
                active: true,
                type: 'structural',
                direction: 'vertical',
                strength: 1.0
              });
            }
          }
          
          // Shear connections (diagonal)
          if (row < rows - 1 && col < cols - 1) {
            const diagonalPoint = gridPoints[row + 1][col + 1];
            if (diagonalPoint) {
              newConnections.push({
                p1: point,
                p2: diagonalPoint,
                restLength: GRID_SIZE * Math.sqrt(2),
                active: true,
                type: 'shear',
                direction: 'diagonal',
                strength: 0.7
              });
            }
          }
          
          if (row < rows - 1 && col > 0) {
            const diagonalPoint = gridPoints[row + 1][col - 1];
            if (diagonalPoint) {
              newConnections.push({
                p1: point,
                p2: diagonalPoint,
                restLength: GRID_SIZE * Math.sqrt(2),
                active: true,
                type: 'shear',
                direction: 'diagonal',
                strength: 0.7
              });
            }
          }
          
          // Bend connections (skip one point for bending resistance)
          if (col < cols - 2) {
            const bendPoint = gridPoints[row][col + 2];
            if (bendPoint) {
              newConnections.push({
                p1: point,
                p2: bendPoint,
                restLength: GRID_SIZE * 2,
                active: true,
                type: 'bend',
                direction: 'bend',
                strength: 0.3
              });
            }
          }
          
          if (row < rows - 2) {
            const bendPoint = gridPoints[row + 2][col];
            if (bendPoint) {
              newConnections.push({
                p1: point,
                p2: bendPoint,
                restLength: GRID_SIZE * 2,
                active: true,
                type: 'bend',
                direction: 'bend',
                strength: 0.3
              });
            }
          }
        }
      }
      
      setPoints(newPoints);
      setConnections(newConnections);
      activeConnectionsRef.current = newConnections;
      visiblePointsRef.current = newPoints;
      
      console.log(`Grid created: ${newPoints.length} points, ${newConnections.length} connections, pinned points: ${newPoints.filter(p => p.pinned).length}`);
    };
    
    resetRef.current = () => {
      colorCacheRef.current.clear();
      resizeCanvas();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Enhanced event listeners with pressure support
    const handlePointerMove = (e: PointerEvent) => handlePointerEvent(e);
    const handlePointerDown = (e: PointerEvent) => {
      mouseRef.current.isDown = true;
      handlePointerEvent(e);
    };
    const handlePointerUp = (e: PointerEvent) => {
      mouseRef.current.isDown = false;
      handlePointerEvent(e);
    };

    // Use pointer events for better tablet support
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isActive]);

  useEffect(() => {
    if (onReset && resetRef.current) {
      onReset.current = { reset: resetRef.current };
    }
  }, [onReset]);

  // High-performance animation loop
  useEffect(() => {
    if (!isActive || points.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      
      // Frame rate limiting to maintain 60 FPS
      if (deltaTime < FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = currentTime;
      frameCountRef.current++;
      
      // Performance monitoring
      updatePerformanceMetrics(deltaTime);
      
      // Memory cleanup every CLEANUP_INTERVAL frames
      if (frameCountRef.current - lastCleanupRef.current > CLEANUP_INTERVAL) {
        cleanupInactiveElements();
        lastCleanupRef.current = frameCountRef.current;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enhanced cutting with pressure sensitivity
      if (mouseRef.current.isDown) {
        const cutRadius = pressureRef.current.supported 
          ? CUT_RADIUS * (0.6 + pressureRef.current.pressure * 0.4)
          : CUT_RADIUS;
          
        activeConnectionsRef.current.forEach(connection => {
          if (!connection.active) return;
          
          const midX = (connection.p1.x + connection.p2.x) / 2;
          const midY = (connection.p1.y + connection.p2.y) / 2;
          
          const distance = Math.sqrt(
            Math.pow(mouseRef.current.x - midX, 2) + 
            Math.pow(mouseRef.current.y - midY, 2)
          );
          
          if (distance < cutRadius) {
            connection.active = false;
          }
        });
        
        // Update active connections cache
        activeConnectionsRef.current = activeConnectionsRef.current.filter(c => c.active);
      }

      // Optimized physics update for visible points only
      visiblePointsRef.current.forEach(point => {
        if (point.pinned || point.cut) return;
        
        // Air resistance (quadratic drag)
        let speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
        if (speed > 0) {
          const drag = AIR_RESISTANCE * speed;
          point.vx -= (point.vx / speed) * drag;
          point.vy -= (point.vy / speed) * drag;
        }
        
        // Apply gravity
        point.vy += GRAVITY;
        
        // Apply damping
        point.vx *= DAMPING;
        point.vy *= DAMPING;
        
        // Velocity limiting
        const maxVelocity = 2.0;
        speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
        if (speed > maxVelocity) {
          const scale = maxVelocity / speed;
          point.vx *= scale;
          point.vy *= scale;
        }
        
        // Update position
        point.x += point.vx;
        point.y += point.vy;
        
        // Boundary constraints
        if (point.x < 0) {
          point.x = 0;
          point.vx *= -0.4;
        }
        if (point.x > canvas.width) {
          point.x = canvas.width;
          point.vx *= -0.4;
        }
        
        // Improved floor collision with less piling
        const floorY = canvas.height - 5;
        if (point.y > floorY) {
          point.y = floorY;
          
          // Bounce with energy loss
          if (Math.abs(point.vy) > SETTLING_THRESHOLD) {
            point.vy *= -FLOOR_BOUNCE;
          } else {
            point.vy = 0; // Stop bouncing if moving slowly
          }
          
          // Floor friction
          point.vx *= FLOOR_FRICTION;
          
          // Spread out points horizontally to reduce piling
          const spreadForce = (Math.random() - 0.5) * 0.02;
          point.vx += spreadForce;
        }
      });

      // Constraint solving with reduced iterations for performance
      const iterations = adaptiveIterationsRef.current;
      for (let iteration = 0; iteration < iterations; iteration++) {
        activeConnectionsRef.current.forEach(connection => {
          if (!connection.active) return;
          
          const dx = connection.p2.x - connection.p1.x;
          const dy = connection.p2.y - connection.p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance === 0) return;
          
          // Tearing based on stretch ratio
          const stretchRatio = distance / connection.restLength;
          if (stretchRatio > TEAR_THRESHOLD) {
            // Create particle effect at tear location
            const tearX = (connection.p1.x + connection.p2.x) / 2;
            const tearY = (connection.p1.y + connection.p2.y) / 2;
            
            let tearColor = 'rgba(255, 255, 255, 0.8)';
            if (rainbowMode) {
              tearColor = getRainbowColor(tearX, tearY, canvas.width, canvas.height);
            }
            
            createTearParticles(tearX, tearY, tearColor);
            connection.active = false;
            return;
          }
          
          // Calculate stiffness based on connection type and direction
          let baseStiffness = STRUCTURAL_STIFFNESS;
          if (connection.direction === 'vertical') {
            baseStiffness = VERTICAL_STIFFNESS; // Higher stiffness for vertical connections
          }
          
          let stiffness = baseStiffness * connection.strength;
          
          // Different stiffness for different connection types
          if (connection.type === 'shear') {
            stiffness *= 0.7; // Slightly more flexible shear
          } else if (connection.type === 'bend') {
            stiffness *= 0.4; // More flexible bending
          }
          
          // Special handling for vertical connections to reduce upward stress transfer
          let stressReduction = 1.0;
          if (connection.direction === 'vertical' && connection.p1.y < connection.p2.y) {
            // This is a downward vertical connection
            // Reduce stress transfer to the upper point
            stressReduction = 0.3; // Only 30% of the correction force affects the upper point
          }
          
          const difference = connection.restLength - distance;
          const percent = (difference / distance / 2) * stiffness;
          
          const offsetX = dx * percent;
          const offsetY = dy * percent;
          
          if (!connection.p1.pinned) {
            if (connection.direction === 'vertical' && connection.p1.y < connection.p2.y) {
              // Reduce upward stress transfer for vertical connections
              connection.p1.x -= offsetX * stressReduction;
              connection.p1.y -= offsetY * stressReduction;
            } else {
              connection.p1.x -= offsetX;
              connection.p1.y -= offsetY;
            }
          }
          if (!connection.p2.pinned) {
            connection.p2.x += offsetX;
            connection.p2.y += offsetY;
          }
        });
        
        // Keep pinned points in place after constraint solving
        visiblePointsRef.current.forEach(point => {
          if (point.pinned) {
            point.x = point.originalX;
            point.y = point.originalY;
            point.vx = 0;
            point.vy = 0;
          }
        });
      }

      // Enhanced mouse interaction with pressure sensitivity
      // Reduce mouse interaction frequency if FPS is low
      const currentFps = performanceMonitorRef.current.avgFps;
      const mouseThrottle = currentFps < 45 ? MOUSE_INTERACTION_THROTTLE * 4 : 
                           currentFps < 55 ? MOUSE_INTERACTION_THROTTLE * 2 : 
                           MOUSE_INTERACTION_THROTTLE;
      
      if (frameCountRef.current % mouseThrottle === 0) {
        const interactionRadius = 60; // Interaction radius for cursor effects
          
        // Calculate mouse velocity for more dynamic interaction
        const mouseVelX = mouseRef.current.x - mouseRef.current.lastX;
        const mouseVelY = mouseRef.current.y - mouseRef.current.lastY;
        const mouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
          
        visiblePointsRef.current.forEach(point => {
          if (point.pinned) return; // Don't interact with pinned points
          
          const dx = point.x - mouseRef.current.x;
          const dy = point.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < interactionRadius && distance > 0) {
            const falloff = (interactionRadius - distance) / interactionRadius;
            
            if (mouseRef.current.isDown) {
              // Strong push force when clicking and dragging
              const pushForce = Math.pow(falloff, 2) * 2.0;
              const pushX = (dx / distance) * pushForce;
              const pushY = (dy / distance) * pushForce;
              
              point.vx += pushX;
              point.vy += pushY;
            } else {
              // Gentle attraction/following when just hovering
              const attractForce = falloff * 0.3 * Math.min(mouseSpeed * 0.1, 1.0);
              const attractX = (-dx / distance) * attractForce;
              const attractY = (-dy / distance) * attractForce;
              
              point.vx += attractX;
              point.vy += attractY;
            }
          }
        });
      }

      // Clean up torn connections
      activeConnectionsRef.current = activeConnectionsRef.current.filter(c => c.active);
      
      // Clean up cut points from the main points array periodically
      if (frameCountRef.current % 120 === 0) { // Every 2 seconds
        const activePinned = points.filter(p => p.pinned && !p.cut);
        const activeUnpinned = points.filter(p => !p.pinned && !p.cut && p.active);
        const newPoints = [...activePinned, ...activeUnpinned];
        
        if (newPoints.length < points.length * 0.8) { // If we've lost 20% of points
          setPoints(newPoints);
          // Also clean up connections that reference cut points
          const validConnections = connections.filter(conn => 
            !conn.p1.cut && !conn.p2.cut && conn.active
          );
          setConnections(validConnections);
          activeConnectionsRef.current = validConnections;
        }
      }

      // Update particles
      updateParticles();

      // Optimized rendering with batching
      ctx.lineWidth = 1;
      
      if (rainbowMode) {
        // Batch connections by color for rainbow mode
        const colorBatches = new Map<string, Connection[]>();
        
        activeConnectionsRef.current.forEach(connection => {
          const midX = (connection.p1.x + connection.p2.x) / 2;
          const midY = (connection.p1.y + connection.p2.y) / 2;
          
          // Always recalculate color for smooth animation
          const colorKey = getRainbowColor(midX, midY, canvas.width, canvas.height);
          
          if (!colorBatches.has(colorKey)) {
            colorBatches.set(colorKey, []);
          }
          colorBatches.get(colorKey)!.push(connection);
        });
        
        // Render each color batch
        colorBatches.forEach((connections, color) => {
          ctx.strokeStyle = color;
          ctx.beginPath();
          connections.forEach(connection => {
            // Different line widths for different connection types
            if (connection.type === 'structural') {
              ctx.lineWidth = 1.2;
            } else if (connection.type === 'shear') {
              ctx.lineWidth = 0.7;
            } else if (connection.type === 'bend') {
              ctx.lineWidth = 0.4;
            }
            ctx.moveTo(connection.p1.x, connection.p1.y);
            ctx.lineTo(connection.p2.x, connection.p2.y);
          });
          ctx.stroke();
        });
        
        // Batch points by color
        const pointColorBatches = new Map<string, Point[]>();
        
        visiblePointsRef.current.forEach(point => {
          const pointColor = getRainbowColor(point.x, point.y, canvas.width, canvas.height);
          // Slightly more opaque for pinned points
          const finalColor = point.pinned 
            ? pointColor.replace(/[\d.]+\)$/, '1.0)')
            : pointColor;
          
          if (!pointColorBatches.has(finalColor)) {
            pointColorBatches.set(finalColor, []);
          }
          pointColorBatches.get(finalColor)!.push(point);
        });
        
        pointColorBatches.forEach((batchPoints, color) => {
          ctx.fillStyle = color;
          batchPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.pinned ? 2 : 1, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      } else {
        // Single color mode - much faster
      // Render particles on top
      renderParticles(ctx);

        // Render different connection types with different styles
        activeConnectionsRef.current.forEach(connection => {
          if (connection.type === 'structural') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1;
          } else if (connection.type === 'shear') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 0.5;
          } else if (connection.type === 'bend') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.3;
          }
          
          ctx.beginPath();
          ctx.moveTo(connection.p1.x, connection.p1.y);
          ctx.lineTo(connection.p2.x, connection.p2.y);
          ctx.stroke();
        });
        
        // Render points
        visiblePointsRef.current.forEach(point => {
          ctx.fillStyle = point.pinned ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.pinned ? 1.5 : 0.8, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, points, connections, rainbowMode]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ 
        background: 'transparent',
        opacity: 0.9,
        touchAction: 'none' // Better touch handling
      }}
    />
  );
};

export default FabricNetting;