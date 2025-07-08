// PWA Install API Availability Checker
function checkPWAInstallAPI() {
    console.log("🔍 Checking PWA Install API availability...");
    console.log("==========================================");
    
    // Check browser information
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    
    console.log(`🌐 Browser: ${navigator.userAgent}`);
    console.log(`📱 Platform: ${navigator.platform}`);
    console.log(`🔧 Is Chrome: ${isChrome}`);
    console.log(`🔧 Is Edge: ${isEdge}`);
    console.log(`🔧 Is Safari: ${isSafari}`);
    console.log(`🔧 Is Firefox: ${isFirefox}`);
    console.log("==========================================");
    
    // Check Service Worker support
    const supportsServiceWorker = 'serviceWorker' in navigator;
    console.log(`⚙️ Service Worker Support: ${supportsServiceWorker ? '✅ YES' : '❌ NO'}`);
    
    // Check Web App Manifest support
    const supportsManifest = 'onappinstalled' in window || 'getInstalledRelatedApps' in navigator;
    console.log(`📋 Web App Manifest Support: ${supportsManifest ? '✅ YES' : '❌ NO'}`);
    
    // Check beforeinstallprompt event support
    const supportsBeforeInstallPrompt = 'onbeforeinstallprompt' in window;
    console.log(`🎯 beforeinstallprompt Event: ${supportsBeforeInstallPrompt ? '✅ YES' : '❌ NO'}`);
    
    // Check getInstalledRelatedApps API
    const supportsGetInstalledRelatedApps = 'getInstalledRelatedApps' in navigator;
    console.log(`📱 getInstalledRelatedApps API: ${supportsGetInstalledRelatedApps ? '✅ YES' : '❌ NO'}`);
    
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    console.log(`🖥️ Currently in Standalone Mode: ${isStandalone ? '✅ YES' : '❌ NO'}`);
    
    // Check HTTPS requirement
    const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
    console.log(`🔒 HTTPS/Localhost: ${isHTTPS ? '✅ YES' : '❌ NO'}`);
    
    // Check for manifest link in HTML
    const manifestLink = document.querySelector('link[rel="manifest"]');
    console.log(`📄 Manifest Link in HTML: ${manifestLink ? '✅ YES' : '❌ NO'}`);
    if (manifestLink) {
        console.log(`   📄 Manifest URL: ${manifestLink.href}`);
    }
    
    console.log("==========================================");
    
    // Overall PWA Install API availability
    const isPWAInstallSupported = supportsServiceWorker && 
                                 supportsBeforeInstallPrompt && 
                                 isHTTPS && 
                                 (isChrome || isEdge);
    
    console.log(`🎉 PWA Install API Available: ${isPWAInstallSupported ? '✅ YES' : '❌ NO'}`);
    
    // Browser-specific notes
    if (isChrome) {
        console.log("📝 Chrome: Full PWA install support available");
    } else if (isEdge) {
        console.log("📝 Edge: Full PWA install support available");
    } else if (isSafari) {
        console.log("📝 Safari: Limited PWA support - uses 'Add to Home Screen' instead");
    } else if (isFirefox) {
        console.log("📝 Firefox: Limited PWA support - manual installation available");
    } else {
        console.log("📝 Other Browser: PWA support may be limited");
    }
    
    // Listen for beforeinstallprompt event
    if (supportsBeforeInstallPrompt) {
        console.log("🔄 Setting up beforeinstallprompt listener...");
        
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log("🎯 beforeinstallprompt event fired!");
            console.log("   📱 PWA is installable");
            console.log("   🎪 User can be prompted to install");
            
            // Prevent the default prompt
            event.preventDefault();
            
            // Store the event for later use
            window.deferredPrompt = event;
            
            console.log("   💾 Install prompt deferred and stored");
        });
        
        // Check if already installed
        window.addEventListener('appinstalled', (event) => {
            console.log("✅ PWA was installed successfully!");
            window.deferredPrompt = null;
        });
    }
    
    // Additional check after a delay
    setTimeout(() => {
        const installPromptAvailable = window.deferredPrompt !== undefined;
        console.log(`⏰ After 3 seconds - Install prompt available: ${installPromptAvailable ? '✅ YES' : '❌ NO'}`);
        
        if (!installPromptAvailable && isPWAInstallSupported) {
            console.log("❓ Possible reasons why install prompt is not available:");
            console.log("   1. User hasn't engaged with the site enough");
            console.log("   2. App is already installed");
            console.log("   3. PWA requirements not fully met");
            console.log("   4. Manifest or Service Worker issues");
        }
    }, 3000);
    
    console.log("==========================================");
    console.log("🏁 PWA Install API check completed!");
    
    return {
        supportsServiceWorker,
        supportsBeforeInstallPrompt,
        supportsGetInstalledRelatedApps,
        isHTTPS,
        hasManifestLink: !!manifestLink,
        isStandalone,
        isPWAInstallSupported,
        browser: {
            isChrome,
            isEdge,
            isSafari,
            isFirefox
        }
    };
}

// Auto-run the check
checkPWAInstallAPI();

// Also expose a function to manually trigger install prompt
function triggerInstallPrompt() {
    if (window.deferredPrompt) {
        console.log("🎪 Triggering install prompt...");
        window.deferredPrompt.prompt();
        
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log("✅ User accepted the install prompt");
            } else {
                console.log("❌ User dismissed the install prompt");
            }
            window.deferredPrompt = null;
        });
    } else {
        console.log("❌ No install prompt available");
    }
}