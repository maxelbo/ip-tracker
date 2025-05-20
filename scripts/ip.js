// Copy IP address to clipboard
function copyIP() {
  const ipText = document.getElementById('ip-address').textContent;
  navigator.clipboard.writeText(ipText).then(() => {
    const copyMessage = document.getElementById('copy-message');
    copyMessage.style.display = 'block';
    setTimeout(() => {
      copyMessage.style.display = 'none';
    }, 2000);
  });
}

// Convert IP to binary
function ipToBinary(ip) {
  return ip.split('.')
    .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
    .join(' ');
}

// Detect OS
function detectOS() {
  const userAgent = navigator.userAgent;
  let os = "Unknown";
  let version = "";
  let architecture = "";

  // Windows detection with version
  if (userAgent.indexOf("Win") !== -1) {
    os = "Windows";
    if (userAgent.indexOf("Windows NT 10.0") !== -1) version = "10/11";
    else if (userAgent.indexOf("Windows NT 6.3") !== -1) version = "8.1";
    else if (userAgent.indexOf("Windows NT 6.2") !== -1) version = "8";
    else if (userAgent.indexOf("Windows NT 6.1") !== -1) version = "7";
    else if (userAgent.indexOf("Windows NT 6.0") !== -1) version = "Vista";
    else if (userAgent.indexOf("Windows NT 5.1") !== -1) version = "XP";
    else if (userAgent.indexOf("Windows NT 5.0") !== -1) version = "2000";

    // Detect architecture
    if (userAgent.indexOf("Win64") !== -1 || userAgent.indexOf("x64") !== -1) {
      architecture = "64-bit";
    } else {
      architecture = "32-bit";
    }
  }
  // macOS detection
  else if (userAgent.indexOf("Mac") !== -1) {
    os = "macOS";
    // Try to extract macOS version (if available)
    const macOSVersionMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
    if (macOSVersionMatch) {
      version = macOSVersionMatch[1].replace(/_/g, '.');
    } else {
      const macOSSimpleMatch = userAgent.match(/Mac OS X (\d+[._]\d+)/);
      if (macOSSimpleMatch) {
        version = macOSSimpleMatch[1].replace(/_/g, '.');
      }
    }

    // Architecture for Mac
    if (userAgent.indexOf("Intel") !== -1) {
      architecture = "Intel";
    } else if (userAgent.indexOf("PPC") !== -1) {
      architecture = "PowerPC";
    } else if (userAgent.indexOf("ARM") !== -1 || userAgent.indexOf("Apple") !== -1) {
      architecture = "Apple Silicon";
    }
  }
  // Linux detection
  else if (userAgent.indexOf("Linux") !== -1) {
    os = "Linux";
    if (userAgent.indexOf("Ubuntu") !== -1) version = "Ubuntu";
    else if (userAgent.indexOf("Fedora") !== -1) version = "Fedora";
    else if (userAgent.indexOf("Debian") !== -1) version = "Debian";

    // Architecture for Linux
    if (userAgent.indexOf("x86_64") !== -1 || userAgent.indexOf("x64") !== -1) {
      architecture = "64-bit";
    } else if (userAgent.indexOf("i686") !== -1 || userAgent.indexOf("i386") !== -1) {
      architecture = "32-bit";
    } else if (userAgent.indexOf("armv") !== -1 || userAgent.indexOf("aarch64") !== -1) {
      architecture = "ARM";
    }
  }
  // Android detection with version
  else if (userAgent.indexOf("Android") !== -1) {
    os = "Android";
    const match = userAgent.match(/Android (\d+(\.\d+)*)/);
    if (match) version = match[1];
  }
  // iOS detection with version
  else if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1 || userAgent.indexOf("iPod") !== -1) {
    os = userAgent.indexOf("iPad") !== -1 ? "iPadOS" : "iOS";
    const match = userAgent.match(/OS (\d+[._]\d+[._]?\d*)/);
    if (match) version = match[1].replace(/_/g, '.');
  }

  return { os, version, architecture };
}

// Detect browser and version
function detectBrowser() {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  let version = "Unknown";

  // Chrome
  if (userAgent.indexOf("Chrome") !== -1 && userAgent.indexOf("Edg") === -1 && userAgent.indexOf("OPR") === -1) {
    browser = "Chrome";
    version = userAgent.match(/Chrome\/([0-9.]+)/)[1];
  }
  // Edge
  else if (userAgent.indexOf("Edg") !== -1) {
    browser = "Edge";
    version = userAgent.match(/Edg\/([0-9.]+)/)[1];
  }
  // Firefox
  else if (userAgent.indexOf("Firefox") !== -1) {
    browser = "Firefox";
    version = userAgent.match(/Firefox\/([0-9.]+)/)[1];
  }
  // Safari
  else if (userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1) {
    browser = "Safari";
    version = userAgent.match(/Version\/([0-9.]+)/)[1];
  }
  // Opera
  else if (userAgent.indexOf("OPR") !== -1) {
    browser = "Opera";
    version = userAgent.match(/OPR\/([0-9.]+)/)[1];
  }

  return { browser, version };
}

document.addEventListener('DOMContentLoaded', function () {
  // Detect and display OS and browser info
  const { os, version, architecture } = detectOS();
  const { browser, version: browserVersion } = detectBrowser();

  document.getElementById('os-info').textContent = os;
  document.getElementById('os-version').textContent = version || 'Unknown';
  document.getElementById('os-arch').textContent = architecture || 'Unknown';
  document.getElementById('browser-info').textContent = browser;
  document.getElementById('browser-version').textContent = browserVersion;

  // Fetch IP address
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const ip = data.ip;
      document.getElementById('ip-address').textContent = ip;

      // Display binary representation
      if (ip.includes('.')) {  // IPv4
        document.getElementById('binary-ip').textContent = ipToBinary(ip);
        document.getElementById('ip-version').textContent = 'IPv4';
      } else {  // IPv6
        document.getElementById('binary-ip').textContent = 'IPv6 binary representation is too long to display';
        document.getElementById('ip-version').textContent = 'IPv6';
      }

      // Fetch geolocation data
      return fetch(`https://ipapi.co/${ip}/json/`);
    })
    .then(response => response.json())
    .then(data => {
      // Create geolocation info cards
      const geoInfoContainer = document.getElementById('geo-info');
      geoInfoContainer.innerHTML = '';

      const geoItems = [
        { label: 'Country', value: data.country_name || 'Unknown' },
        { label: 'Region', value: data.region || 'Unknown' },
        { label: 'City', value: data.city || 'Unknown' },
        { label: 'ISP', value: data.org || 'Unknown' }
      ];

      geoItems.forEach(item => {
        const geoItem = document.createElement('div');
        geoItem.className = 'geo-item';
        geoItem.innerHTML = `
                        <h3>${item.label}</h3>
                        <p>${item.value}</p>
                    `;
        geoInfoContainer.appendChild(geoItem);
      });
    })
    .catch(error => {
      document.getElementById('ip-address').innerHTML =
        'Failed to retrieve IP<br><span class="error-message small-font">Error: ' + error.message + '</span>';
      document.getElementById('geo-info').innerHTML =
        '<div class="error-message">Failed to load location data</div>';
      document.getElementById('binary-ip').textContent = 'Unable to generate binary';
    });

  // Set user agent info
  document.getElementById('user-agent').textContent =
    navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';

  // Set screen info
  document.getElementById('screen-info').textContent =
    `${window.screen.width}×${window.screen.height}`;
});