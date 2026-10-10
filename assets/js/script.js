// Initialize Lucide Icons
lucide.createIcons();

// --- Shared helpers ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sandbox log (safe to call even if the log panel isn't in the page)
const simulationLogs = document.getElementById('simulation-logs');
function logToConsole(message) {
    if (!simulationLogs) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logNode = document.createElement('div');
    logNode.innerHTML = `<span class="text-slate-500">[${timestamp}]</span> ${message}`;
    simulationLogs.appendChild(logNode);
    simulationLogs.scrollTop = simulationLogs.scrollHeight;
}

// --- Theme Management (Light / Dark Mode) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Initialize Theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
} else {
    document.documentElement.classList.remove('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        logToConsole('[Theme] Switched to Light Mode.');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        logToConsole('[Theme] Switched to Dark Mode.');
    }
});

// --- Mobile Navigation Toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on click of nav items
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- Hero Typing Effect ---
const typewriter = document.getElementById('typewriter');
const phrases = ['Data Scientist', 'NLP & RAG Builder', 'Agentic AI Developer'];

if (typewriter) {
    if (prefersReducedMotion) {
        // No typing or cycling: show everything statically
        typewriter.textContent = phrases.join(' / ');
    } else {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typePhrase = () => {
            if (document.hidden) {
                setTimeout(typePhrase, 500); // pause while the tab is in the background
                return;
            }

            const current = phrases[phraseIndex];
            let delay;

            if (isDeleting) {
                charIndex--;
                delay = 35;
            } else {
                charIndex++;
                delay = 75;
            }
            typewriter.textContent = current.substring(0, charIndex);

            if (!isDeleting && charIndex === current.length) {
                isDeleting = true;
                delay = 1800; // hold the full phrase
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
            }

            setTimeout(typePhrase, delay);
        };

        setTimeout(typePhrase, 700); // start after the hero fade-up has landed
    }
}

// Guarded so the page works whether or not #neural-canvas exists (reused in step 7)
function initNeuralBackground() {
    if (!document.getElementById('neural-canvas')) return;

    // --- Live Neural Network background rendering ---
    const neuralCanvas = document.getElementById('neural-canvas');
    const ctxNeural = neuralCanvas.getContext('2d');
    let width = (neuralCanvas.width = 400);
    let height = (neuralCanvas.height = 400);

    let nodes = [];
    const nodeCount = 35;
    const connectionDistance = 85;

    class NeuralNode {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.0;
            this.vy = (Math.random() - 0.5) * 1.0;
            this.radius = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            const isDark = document.documentElement.classList.contains('dark');
            ctxNeural.fillStyle = isDark ? 'rgba(56, 189, 248, 0.7)' : 'rgba(2, 132, 199, 0.7)';
            ctxNeural.beginPath();
            ctxNeural.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctxNeural.fill();
        }
    }

    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new NeuralNode());
    }

    function animateNeuralNetwork() {
        ctxNeural.clearRect(0, 0, width, height);
        const isDark = document.documentElement.classList.contains('dark');

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Draw connection paths
        ctxNeural.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.15;
                    ctxNeural.strokeStyle = isDark 
                        ? `rgba(56, 189, 248, ${alpha})` 
                        : `rgba(2, 132, 199, ${alpha})`;
                    ctxNeural.beginPath();
                    ctxNeural.moveTo(nodes[i].x, nodes[i].y);
                    ctxNeural.lineTo(nodes[j].x, nodes[j].y);
                    ctxNeural.stroke();
                }
            }
        }

        requestAnimationFrame(animateNeuralNetwork);
    }
    animateNeuralNetwork();

    // Resize observer for Neural Canvas
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            width = neuralCanvas.width = entry.contentRect.width || 400;
            height = neuralCanvas.height = entry.contentRect.height || 400;
        }
    });
    resizeObserver.observe(neuralCanvas.parentElement);
}
initNeuralBackground();

// Guarded so the page works whether or not the K-Means sandbox markup exists
function initKmeansDemo() {
    if (!document.getElementById('kmeans-canvas')) return;

    // --- Interactive K-Means Clustering Sandbox ---
    const kmeansCanvas = document.getElementById('kmeans-canvas');
    const ctxKmeans = kmeansCanvas.getContext('2d');
    const kSlider = document.getElementById('k-slider');
    const kValue = document.getElementById('k-value');
    const algoStatus = document.getElementById('algo-status');
    const canvasHint = document.getElementById('canvas-hint');

    // Controls
    const btnRandomInit = document.getElementById('btn-init-random');
    const btnKmeansPlus = document.getElementById('btn-init-kmeansplus');
    const btnGenerateData = document.getElementById('btn-generate-data');
    const btnStep = document.getElementById('btn-step');
    const btnPlay = document.getElementById('btn-play');
    const btnClear = document.getElementById('btn-clear');

    let canvasWidth = 600;
    let canvasHeight = 400;

    let points = [];
    let centroids = [];
    let K = 3;
    let initMethod = 'random'; // 'random' or 'kmeans++'
    let algoState = 'initialized'; // 'initialized', 'assigned', 'converged'
    let iterations = 0;
    let autoRunInterval = null;

    const clusterColors = [
        { fill: '#0ea5e9', border: '#0284c7' }, // Sky/Brand (Cluster 1)
        { fill: '#10b981', border: '#059669' }, // Emerald (Cluster 2)
        { fill: '#f59e0b', border: '#d97706' }, // Amber (Cluster 3)
        { fill: '#ec4899', border: '#db2777' }, // Pink (Cluster 4)
        { fill: '#8b5cf6', border: '#7c3aed' }, // Violet (Cluster 5)
        { fill: '#f43f5e', border: '#e11d48' }  // Rose (Cluster 6)
    ];

    function resizeKmeansCanvas() {
        const parent = kmeansCanvas.parentElement;
        canvasWidth = kmeansCanvas.width = parent.clientWidth;
        canvasHeight = kmeansCanvas.height = parent.clientHeight || 400;
        drawKmeansSpace();
    }
    window.addEventListener('resize', resizeKmeansCanvas);
    setTimeout(resizeKmeansCanvas, 100);

    // Coordinate vectors generator
    function generateRandomPoints(num = 80) {
        points = [];
        const centers = [];
        const numCenters = K;

        // Create virtual center regions to make clustering look highly realistic
        for (let i = 0; i < numCenters; i++) {
            centers.push({
                x: Math.random() * (canvasWidth - 160) + 80,
                y: Math.random() * (canvasHeight - 120) + 60
            });
        }

        // Distribute nodes around the centers with gaussian-like variance
        for (let i = 0; i < num; i++) {
            const center = centers[Math.floor(Math.random() * numCenters)];
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * Math.min(canvasWidth, canvasHeight) * 0.15 * Math.random();
        
            points.push({
                x: Math.max(10, Math.min(canvasWidth - 10, center.x + Math.cos(angle) * radius)),
                y: Math.max(10, Math.min(canvasHeight - 10, center.y + Math.sin(angle) * radius)),
                cluster: -1
            });
        }
    }

    // Initial Centroid placement selection methods
    function initializeCentroids() {
        centroids = [];
        iterations = 0;
        algoState = 'initialized';
        updateStatusDisplay();

        if (points.length === 0) {
            logToConsole('[Error] Cannot place centroids: no data points found.');
            return;
        }

        if (initMethod === 'random') {
            // Uniform random picking of points to act as centroid seeds
            const shuffled = [...points].sort(() => 0.5 - Math.random());
            for (let i = 0; i < K; i++) {
                if (shuffled[i]) {
                    centroids.push({
                        x: shuffled[i].x,
                        y: shuffled[i].y,
                        prevX: shuffled[i].x,
                        prevY: shuffled[i].y
                    });
                }
            }
            logToConsole(`[Algo] Centroids placed randomly at seeds: K=${K}.`);
        } else {
            // K-Means++ implementation
            // 1. Pick first centroid uniformly at random
            const firstIdx = Math.floor(Math.random() * points.length);
            centroids.push({
                x: points[firstIdx].x,
                y: points[firstIdx].y,
                prevX: points[firstIdx].x,
                prevY: points[firstIdx].y
            });

            // 2. Loop until K centroids are found
            while (centroids.length < K) {
                const distances = points.map(p => {
                    // Find distance to the closest selected centroid
                    let minDist = Infinity;
                    centroids.forEach(c => {
                        const distSq = Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
                        if (distSq < minDist) minDist = distSq;
                    });
                    return minDist;
                });

                // Weighted probability distribution selection
                const totalDist = distances.reduce((a, b) => a + b, 0);
                let cumulativeProb = 0;
                const r = Math.random() * totalDist;
                let chosenIdx = 0;

                for (let i = 0; i < distances.length; i++) {
                    cumulativeProb += distances[i];
                    if (cumulativeProb >= r) {
                        chosenIdx = i;
                        break;
                    }
                }

                centroids.push({
                    x: points[chosenIdx].x,
                    y: points[chosenIdx].y,
                    prevX: points[chosenIdx].x,
                    prevY: points[chosenIdx].y
                });
            }
            logToConsole(`[Algo] Centroids placed using K-Means++ (probabilistic seeding): K=${K}.`);
        }

        // Reset points assigned cluster indices
        points.forEach(p => p.cluster = -1);
        drawKmeansSpace();
    }

    // Distance solver helper (Euclidean space)
    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    // Assignment stage: assign points to closest centroids
    function assignClusters() {
        if (centroids.length === 0) return;

        let changesCount = 0;
        points.forEach(p => {
            let minDist = Infinity;
            let bestCluster = -1;

            centroids.forEach((c, idx) => {
                const dist = getDistance(p, c);
                if (dist < minDist) {
                    minDist = dist;
                    bestCluster = idx;
                }
            });

            if (p.cluster !== bestCluster) {
                p.cluster = bestCluster;
                changesCount++;
            }
        });

        algoState = 'assigned';
        logToConsole(`[Step] Assigned data elements to clusters. Total adjustments: ${changesCount}.`);
        drawKmeansSpace();
    }

    // Update stage: recalculate centroids position
    function updateCentroids() {
        if (centroids.length === 0) return;

        let totalShift = 0;

        centroids.forEach((c, idx) => {
            c.prevX = c.x;
            c.prevY = c.y;

            const clusterPoints = points.filter(p => p.cluster === idx);
            if (clusterPoints.length > 0) {
                // Find mathematical mean coordinate
                const meanX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
                const meanY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;

                totalShift += getDistance(c, { x: meanX, y: meanY });
                c.x = meanX;
                c.y = meanY;
            }
        });

        iterations++;
        updateStatusDisplay();

        // Check convergence criteria
        if (totalShift < 0.25) {
            algoState = 'converged';
            logToConsole(`[Status] Convergence achieved! Mathematical bounds stabilized after ${iterations} iterations.`);
            stopAutoRun();
        } else {
            algoState = 'initialized'; // loop back to assign stage
            logToConsole(`[Step] Updated centroids. Convergence offset metric: ${totalShift.toFixed(2)}px.`);
        }

        drawKmeansSpace();
    }

    // Draw method
    function drawKmeansSpace() {
        ctxKmeans.clearRect(0, 0, canvasWidth, canvasHeight);
        const isDark = document.documentElement.classList.contains('dark');

        // Draw grid background line references
        ctxKmeans.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
        ctxKmeans.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < canvasWidth; x += gridSize) {
            ctxKmeans.beginPath();
            ctxKmeans.moveTo(x, 0);
            ctxKmeans.lineTo(x, canvasHeight);
            ctxKmeans.stroke();
        }
        for (let y = 0; y < canvasHeight; y += gridSize) {
            ctxKmeans.beginPath();
            ctxKmeans.moveTo(0, y);
            ctxKmeans.lineTo(canvasWidth, y);
            ctxKmeans.stroke();
        }

        // Draw boundary vectors (connecting points to their assigned centroid)
        if (algoState === 'assigned' || algoState === 'converged' || iterations > 0) {
            points.forEach(p => {
                if (p.cluster !== -1 && centroids[p.cluster]) {
                    ctxKmeans.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
                    ctxKmeans.lineWidth = 0.5;
                    ctxKmeans.beginPath();
                    ctxKmeans.moveTo(p.x, p.y);
                    ctxKmeans.lineTo(centroids[p.cluster].x, centroids[p.cluster].y);
                    ctxKmeans.stroke();
                }
            });
        }

        // Draw data points
        points.forEach(p => {
            ctxKmeans.beginPath();
            ctxKmeans.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        
            if (p.cluster === -1) {
                ctxKmeans.fillStyle = isDark ? '#475569' : '#cbd5e1'; // Grey (unassigned)
                ctxKmeans.strokeStyle = isDark ? '#1e293b' : '#94a3b8';
            } else {
                const colors = clusterColors[p.cluster % clusterColors.length];
                ctxKmeans.fillStyle = colors.fill;
                ctxKmeans.strokeStyle = isDark ? '#020617' : '#ffffff';
            }
            ctxKmeans.lineWidth = 1;
            ctxKmeans.fill();
            ctxKmeans.stroke();
        });

        // Draw centroids
        centroids.forEach((c, idx) => {
            const colors = clusterColors[idx % clusterColors.length];
        
            // Halo effect for active centroid node
            ctxKmeans.beginPath();
            ctxKmeans.arc(c.x, c.y, 14, 0, Math.PI * 2);
            ctxKmeans.fillStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
            ctxKmeans.fill();

            // Core Centroid Star
            ctxKmeans.beginPath();
            ctxKmeans.arc(c.x, c.y, 7.5, 0, Math.PI * 2);
            ctxKmeans.fillStyle = colors.fill;
            ctxKmeans.strokeStyle = isDark ? '#ffffff' : '#020617';
            ctxKmeans.lineWidth = 2.5;
            ctxKmeans.fill();
            ctxKmeans.stroke();

            // Star core marker
            ctxKmeans.fillStyle = '#ffffff';
            ctxKmeans.font = 'bold 9px Arial';
            ctxKmeans.textAlign = 'center';
            ctxKmeans.textBaseline = 'middle';
            ctxKmeans.fillText('C', c.x, c.y);
        });
    }

    function updateStatusDisplay() {
        algoStatus.textContent = `${algoState.toUpperCase()} (${iterations} iter)`;
        if (algoState === 'converged') {
            algoStatus.className = "text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg";
        } else {
            algoStatus.className = "text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-950/50 px-3 py-1.5 rounded-lg";
        }
    }

    // Trigger algorithm iteration step sequence
    function stepAlgorithm() {
        if (centroids.length === 0) {
            initializeCentroids();
            return;
        }

        if (algoState === 'initialized') {
            assignClusters();
        } else if (algoState === 'assigned') {
            updateCentroids();
        } else if (algoState === 'converged') {
            logToConsole('[System] Solution stabilized already. Use Re-Generate to restart.');
            stopAutoRun();
        }
    }

    function startAutoRun() {
        if (autoRunInterval) return;
    
        btnPlay.innerHTML = `<i data-lucide="square" class="w-4 h-4 mr-1.5"></i> Pause`;
        lucide.createIcons();
    
        autoRunInterval = setInterval(() => {
            stepAlgorithm();
        }, 600);
        logToConsole('[System] Automatic convergence tracking execution started.');
    }

    function stopAutoRun() {
        if (!autoRunInterval) return;
        clearInterval(autoRunInterval);
        autoRunInterval = null;
        btnPlay.innerHTML = `<i data-lucide="play" class="w-4 h-4 mr-1.5"></i> Auto Run`;
        lucide.createIcons();
        logToConsole('[System] Automatic run paused.');
    }

    // User interaction injection (adds custom dots on mouse clicking canvas coordinate)
    kmeansCanvas.addEventListener('click', (e) => {
        // Hide hint overlay
        canvasHint.style.opacity = '0';

        const rect = kmeansCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        points.push({ x, y, cluster: -1 });
        logToConsole(`[Data] Custom point injected at local coordinate index: (${Math.round(x)}, ${Math.round(y)}).`);

        if (algoState === 'converged') {
            algoState = 'initialized';
            updateStatusDisplay();
        }

        drawKmeansSpace();
    });

    // Settings Events
    kSlider.addEventListener('input', (e) => {
        K = parseInt(e.target.value);
        kValue.textContent = K;
        logToConsole(`[Settings] Number of clusters adjusted: K=${K}. Re-centering recommended.`);
    });

    btnRandomInit.addEventListener('click', () => {
        initMethod = 'random';
        btnRandomInit.className = "px-3 py-2 text-xs font-semibold rounded-lg border border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 transition-all";
        btnKmeansPlus.className = "px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-500 dark:hover:border-brand-500 transition-all";
        initializeCentroids();
    });

    btnKmeansPlus.addEventListener('click', () => {
        initMethod = 'kmeans++';
        btnKmeansPlus.className = "px-3 py-2 text-xs font-semibold rounded-lg border border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 transition-all";
        btnRandomInit.className = "px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-500 dark:hover:border-brand-500 transition-all";
        initializeCentroids();
    });

    btnGenerateData.addEventListener('click', () => {
        stopAutoRun();
        generateRandomPoints(80);
        initializeCentroids();
        logToConsole('[Data] Generated a randomized synthetic spatial dataset.');
    });

    btnStep.addEventListener('click', () => {
        stopAutoRun();
        stepAlgorithm();
    });

    btnPlay.addEventListener('click', () => {
        if (autoRunInterval) {
            stopAutoRun();
        } else {
            startAutoRun();
        }
    });

    btnClear.addEventListener('click', () => {
        stopAutoRun();
        points = [];
        centroids = [];
        iterations = 0;
        algoState = 'initialized';
        updateStatusDisplay();
        drawKmeansSpace();
        logToConsole('[Data] Memory cleared. All coordinates and centroids purged.');
    });

    // Initialize first data run automatically
    generateRandomPoints(85);
    initializeCentroids();
}
initKmeansDemo();

// --- Projects Filters ---
const filterButtons = document.querySelectorAll('.project-filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset active state classes on buttons
        filterButtons.forEach(b => {
            b.className = "project-filter-btn px-4 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all";
        });
        // Set active styling to clicked button
        btn.className = "project-filter-btn px-4 py-1.5 text-xs font-semibold rounded-full bg-brand-600 text-white shadow-sm transition-all";

        const filterVal = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            if (filterVal === 'all' || cat === filterVal) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});


// --- Contact Form (opens the visitor's email app with the message pre-filled) ---
const CONTACT_EMAIL = 'codewithbilalshaheen@gmail.com';
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
const btnSendMessage = document.getElementById('btn-send-message');

function showFeedback(isError, message) {
    formFeedback.classList.remove('hidden', 'bg-emerald-100', 'text-emerald-800', 'dark:bg-emerald-950/30', 'dark:text-emerald-400',
        'bg-red-100', 'text-red-800', 'dark:bg-red-950/30', 'dark:text-red-400');
    if (isError) {
        formFeedback.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-950/30', 'dark:text-red-400');
    } else {
        formFeedback.classList.add('bg-emerald-100', 'text-emerald-800', 'dark:bg-emerald-950/30', 'dark:text-emerald-400');
    }
    formFeedback.textContent = message;
}

btnSendMessage.addEventListener('click', (e) => {
    e.preventDefault();

    // Native validation (required fields, valid email) with browser messages
    if (!contactForm.reportValidity()) {
        showFeedback(true, 'Please fill out all fields with a valid email address.');
        return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const body = `${message}\n\n--\n${name}\n${email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    showFeedback(false, `Opening your email app. If nothing opens, write to me at ${CONTACT_EMAIL}.`);
});


// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Cursor ring (mouse devices only, skipped for reduced motion) ---
(function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasMouse || prefersReducedMotion) {
        cursor.remove();
        return;
    }

    const interactive = 'a, button, input, textarea, select, label, [role="button"], summary';
    let x = 0, y = 0;      // real pointer position
    let rx = 0, ry = 0;    // ring position (eased)
    let frame = null;
    let shown = false;

    const render = () => {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        cursor.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

        // Stop the loop once the ring has caught up, so it costs nothing at rest
        if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) {
            frame = requestAnimationFrame(render);
        } else {
            frame = null;
        }
    };

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        x = e.clientX;
        y = e.clientY;

        if (!shown) {          // first move: appear in place instead of flying in
            shown = true;
            rx = x;
            ry = y;
            cursor.classList.add('is-visible');
        }

        cursor.classList.toggle('is-hover', !!e.target.closest(interactive));
        if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });

    document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

    document.documentElement.addEventListener('mouseleave', () => {
        shown = false;
        cursor.classList.remove('is-visible');
    });
})();