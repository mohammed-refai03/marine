const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

// Configuration
const TARGET_DIR = path.resolve(__dirname);
const ASSETS_IMAGES_DIR = path.join(TARGET_DIR, 'assets', 'images');
const MAX_FILE_SIZE_KB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;

// Known keywords mapping for Unsplash photo IDs to generate meaningful names when alt text is absent
const KNOWN_KEYWORDS = {
  '1546026423-cc4642628d2b': 'coral-reef-vibrant',
  '1628102422437-2dbb4a57c94f': 'beach-plastic-waste',
  '1583212292454-1fe6229603b7': 'deep-sea-jellyfish',
  '1507525428034-b723cf961d3e': 'pristine-beach-coast',
  '1437622368342-7a3d73a34c8f': 'sea-turtle-swimming',
  '1551244072-5d12893278ab': 'marine-wildlife-fish',
  '1544551763-46a013bb70d5': 'scientific-scuba-divers',
  '1582967788606-a171c1080cb0': 'coral-restoration-team',
  '1447752875215-b2761acb3c5d': 'atmospheric-climate',
  '1534528741775-53994a69daeb': 'dr-elena-jenkins',
  '1511216173024-e200bc87679f': 'autonomous-ocean-skimmer',
  '1522069169874-c58ec4b76be5': 'healthy-coral-fish',
  '1509062522246-3755977927d7': 'environmental-education',
  '1570481662006-a3a1374699e8': 'dolphin-cetacean-pod',
  '1507003211169-0a1dd7228f2d': 'marcus-thornton',
  '1573496359142-b8d87734a5a2': 'sarah-jenkins',
  '1524661135-423995f22d0b': 'ocean-satellite-map',
  '1505118380757-91f5f5632de0': 'aerial-ocean-waves',
  '1621451537084-482c730e386e': 'plastic-bottle-beach',
  '1553856622-d1b352e9a211': 'scientific-microscope-lab',
  '1570481662006-a341ef72780e': 'humpback-whale-tail',
  '1516026672322-bc52d61a55d5': 'underwater-reef-nursery',
  '1518877593221-1f28583780b4': 'deep-teal-wave-pattern',
  '1454789548928-9efd52dc4031': 'satellite-space-view',
  '1504384308090-c894fdcc538d': 'scientific-computer-lab',
  '1451187580459-43490279c0fa': 'global-network-earth',
  '1484755560693-a4074577af3a': 'sunlit-underwater-ocean',
  '1682687220063-4742bd7fd538': 'diver-in-deep-ocean',
  '1548248823-ceca48559f19': 'floating-plastic-bottle',
  '1506784983877-45594efa4cbe': 'bleached-stressed-coral',
  '1534818113099-dbe2b2e80015': 'overfishing-net-catch',
  '1568430462989-4b16f61f2cf6': 'dolphin-leaping-sea',
  '1568430462989-4b16f61f2cfc': 'dolphin-jumping',
  '1563245372-f21724e3856d': 'volunteers-beach-trash',
  '1427504494785-3a9ca7044f45': 'classroom-lecture-students',
  '1532996122724-e3347d70d22b': 'sorted-recyclable-plastics',
  '1598978213401-60a6722d4f20': 'conservationist-sea-turtle',
  '1518837695005-2083093ee35b': 'swimming-sea-turtle-sanctuary',
  '1530122037265-a5f1f91d3b99': 'deep-ocean-light-rays',
  '1546026423-cc4642628d2b': 'coral-reef-healthy',
  '1544551763-839d4868d221': 'scuba-diver-coral'
};

// Fallback Unsplash IDs mapping for photos that return 404 (deleted from Unsplash)
const DEAD_PHOTO_FALLBACKS = {
  '1628102422437-2dbb4a57c94f': '1563245372-f21724e3856d', // Beach volunteers
  '1621451537084-482c730e386e': '1507525428034-b723cf961d3e', // Beach coastline
  '1511216173024-e200bc87679f': '1551244072-5d12893278ab', // Fish / reef
  '1570481662006-a341ef72780e': '1437622368342-7a3d73a34c8f', // Turtle
  '1548248823-ceca48559f19': '1505118380757-91f5f5632de0', // Ocean waves
  '1534818113099-dbe2b2e80015': '1551244072-5d12893278ab', // Fish / reef
  '1568430462989-4b16f61f2cf6': '1551244072-5d12893278ab', // Fish / reef
  '1568430462989-4b16f61f2cfc': '1551244072-5d12893278ab', // Fish / reef
  '1570481662006-a3a1374699e8': '1551244072-5d12893278ab', // Fish / reef
  '1484755560693-a4074577af3a': '1518877593221-1f28583780b4', // Waves / reef
  '1506784983877-45594efa4cbe': '1546026423-cc4642628d2b'  // Vibrant coral
};

// Helper to slugify strings for filename safety
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Get photo ID from Unsplash URL
function getUnsplashId(url) {
  if (url.includes('unsplash.com')) {
    const match = url.match(/\/photo-([a-zA-Z0-9-]+)/);
    if (match) return match[1];
  }
  return null;
}

// Generate a clean, descriptive slug for the image URL based on alt tags or path details
function determineFilename(url, fileContentsMap) {
  // Try to find alt tag associated with this URL in any of the files
  let bestAlt = '';
  const photoId = getUnsplashId(url);

  for (const [filepath, content] of Object.entries(fileContentsMap)) {
    // Escape special characters in URL for regex
    const escapedUrl = url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Regex to find <img> tag with this src and extract alt
    const imgRegex = new RegExp(`<img[^>]+src=["']${escapedUrl}["'][^>]*>`, 'gi');
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const tag = match[0];
      const altMatch = tag.match(/alt=["']([^"']*)["']/i);
      if (altMatch && altMatch[1] && altMatch[1].trim()) {
        const altText = altMatch[1].trim();
        if (altText.length > bestAlt.length) {
          bestAlt = altText;
        }
      }
    }
  }

  let baseName = '';
  if (bestAlt) {
    baseName = slugify(bestAlt);
  } else if (photoId) {
    // Fallback to known keywords
    if (KNOWN_KEYWORDS[photoId]) {
      baseName = KNOWN_KEYWORDS[photoId];
    } else {
      baseName = `marine-unsplash-${photoId.substring(0, 8)}`;
    }
  } else {
    // General URL path fallback
    const pathname = new URL(url).pathname;
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    const namePart = lastPart.split('.')[0] || 'external-image';
    baseName = slugify(namePart);
  }

  // Ensure filename doesn't end up empty
  if (!baseName) {
    baseName = 'marine-image';
  }

  // If Unsplash, append short ID to keep it descriptive but unique
  if (photoId) {
    const shortId = photoId.split('-')[0] || photoId.substring(0, 6);
    // Don't append if the short ID is already part of the name
    if (!baseName.includes(shortId)) {
      baseName = `${baseName}-${shortId}`;
    }
  }

  return `${baseName}.webp`;
}

// Adaptively compress the downloaded image buffer using sharp to fit under 100 KB
async function optimizeImage(buffer, originalUrl) {
  const metadata = await sharp(buffer).metadata();
  let quality = 80;
  let width = metadata.width;
  let compressedBuffer;
  
  do {
    let pipeline = sharp(buffer);
    
    // If image is very wide, resize it down to maximum 1600px wide (or 1200px if we need more compression)
    let targetWidth = width;
    if (quality < 60 && targetWidth > 1200) {
      targetWidth = 1200;
    } else if (targetWidth > 1600) {
      targetWidth = 1600;
    }
    
    if (targetWidth < width) {
      pipeline = pipeline.resize({ width: targetWidth });
    }
    
    compressedBuffer = await pipeline
      .webp({ quality })
      .toBuffer();
      
    if (compressedBuffer.length <= MAX_FILE_SIZE_BYTES) {
      break; // Successfully under 100 KB
    }
    
    // Adaptively decrease quality
    quality -= 10;
    
    // If quality gets very low, resize smaller
    if (quality < 30) {
      if (width > 800) {
        width = 800; // Force downsize
        quality = 60; // Reset quality for smaller dimensions
      } else {
        // Absolute compression floor
        compressedBuffer = await sharp(buffer)
          .resize({ width: Math.min(width, 600) })
          .webp({ quality: 20 })
          .toBuffer();
        break;
      }
    }
  } while (true);

  return {
    buffer: compressedBuffer,
    width: width,
    quality: quality,
    sizeKb: (compressedBuffer.length / 1024).toFixed(2)
  };
}

// Helper function to download a URL with retries
async function downloadWithRetry(url, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await axios({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
        timeout: 25000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
    } catch (downloadErr) {
      attempt++;
      if (attempt >= retries || (downloadErr.response && downloadErr.response.status === 404)) {
        throw downloadErr; // Throw immediately if 404 or out of retries
      }
      console.log(`Download failed (${downloadErr.message}). Retrying attempt ${attempt + 1}/${retries} after delay...`);
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
  }
}

async function main() {
  console.log('=== Marine Conservation Project Image Optimizer ===');
  
  // 1. Create directories
  if (!fs.existsSync(ASSETS_IMAGES_DIR)) {
    fs.mkdirSync(ASSETS_IMAGES_DIR, { recursive: true });
    console.log(`Created directory: ${ASSETS_IMAGES_DIR}`);
  }

  // 2. Scan project HTML files
  const htmlFiles = fs.readdirSync(TARGET_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(TARGET_DIR, file));
    
  console.log(`Found ${htmlFiles.length} HTML files to scan.`);

  // Load files in memory
  const fileContentsMap = {};
  for (const filepath of htmlFiles) {
    fileContentsMap[filepath] = fs.readFileSync(filepath, 'utf8');
  }

  // 3. Extract unique external/Unsplash URLs
  const externalUrls = new Set();
  const urlRegex = /https?:\/\/(?:images\.unsplash\.com\/photo-[a-zA-Z0-9-]+|[^"'\s\)]+\.(?:jpg|jpeg|png|webp|gif|svg))(?:\?[^"'\s\)]*)?/gi;

  for (const [filepath, content] of Object.entries(fileContentsMap)) {
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      externalUrls.add(match[0]);
    }
  }

  console.log(`Found ${externalUrls.size} unique external image URLs.`);

  // 4. Map unique URLs to filenames to prevent duplicates
  const urlMapping = {};
  const filenameCounts = {};

  for (const url of externalUrls) {
    let filename = determineFilename(url, fileContentsMap);
    
    // De-duplicate local filenames just in case
    let nameWithoutExt = path.basename(filename, '.webp');
    let finalFilename = filename;
    let counter = 1;
    while (filenameCounts[finalFilename]) {
      finalFilename = `${nameWithoutExt}-${counter}.webp`;
      counter++;
    }
    filenameCounts[finalFilename] = true;
    urlMapping[url] = finalFilename;
  }

  // 5. Download and optimize
  const report = {
    found: externalUrls.size,
    downloaded: 0,
    converted: 0,
    totalSizeKb: 0,
    referencesUpdated: 0,
    failed: 0,
    failuresList: []
  };

  const localMappingTable = {}; // Map of URL to local assets/images/filename.webp path

  console.log('\n--- Downloading and Optimizing Images ---');
  
  for (const url of Object.keys(urlMapping)) {
    const filename = urlMapping[url];
    const destinationPath = path.join(ASSETS_IMAGES_DIR, filename);
    const localUrlPath = `assets/images/${filename}`;

    try {
      console.log(`Downloading: ${url}`);
      
      const photoId = getUnsplashId(url);
      let downloadUrl = url;
      let usedFallback = false;

      // 1. Check if ID has a defined dead photo fallback
      if (photoId && DEAD_PHOTO_FALLBACKS[photoId]) {
        const fallbackId = DEAD_PHOTO_FALLBACKS[photoId];
        downloadUrl = url.replace(photoId, fallbackId);
        console.log(`Redirecting download from dead ID ${photoId} to fallback working ID ${fallbackId}`);
        usedFallback = true;
      }

      // 2. Perform download with retry
      let response;
      try {
        response = await downloadWithRetry(downloadUrl, 3);
      } catch (err) {
        // 3. If failed with 404 and we haven't redirected yet, try the global working fallback ID
        if (err.response && err.response.status === 404 && !usedFallback && photoId) {
          const universalFallbackId = '1551244072-5d12893278ab'; // Confirmed working fish reef
          console.log(`URL returned 404. Attempting universal fallback ID ${universalFallbackId}`);
          downloadUrl = url.replace(photoId, universalFallbackId);
          response = await downloadWithRetry(downloadUrl, 3);
        } else {
          throw err;
        }
      }

      console.log(`Processing and compressing: ${filename}`);
      const optimized = await optimizeImage(response.data, url);

      // Write WebP file
      fs.writeFileSync(destinationPath, optimized.buffer);
      console.log(`Successfully saved: ${localUrlPath} (${optimized.sizeKb} KB)`);

      report.downloaded++;
      report.converted++;
      report.totalSizeKb += parseFloat(optimized.sizeKb);

      localMappingTable[url] = localUrlPath;

    } catch (error) {
      console.error(`[ERROR] Failed to process URL: ${url}`);
      console.error(`Reason: ${error.message}`);
      report.failed++;
      report.failuresList.push({ url, error: error.message });
    }
  }

  // 6. Update references in HTML files
  console.log('\n--- Updating Project HTML & Inline Style References ---');
  
  for (const filepath of htmlFiles) {
    let content = fileContentsMap[filepath];
    let fileUpdated = false;
    let fileRefsCount = 0;

    for (const [externalUrl, localPath] of Object.entries(localMappingTable)) {
      // Escape URL for matching in regex/split-join
      const escapedUrl = externalUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const searchRegex = new RegExp(escapedUrl, 'g');
      
      if (searchRegex.test(content)) {
        // Count matches
        const matches = content.match(searchRegex) || [];
        fileRefsCount += matches.length;
        
        // Replace
        content = content.replace(searchRegex, localPath);
        fileUpdated = true;
      }
    }

    if (fileUpdated) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated: ${path.basename(filepath)} - replaced ${fileRefsCount} reference(s)`);
      report.referencesUpdated += fileRefsCount;
    } else {
      console.log(`No changes needed in: ${path.basename(filepath)}`);
    }
  }

  // 7. Summary Report
  const avgSize = report.converted > 0 ? (report.totalSizeKb / report.converted).toFixed(2) : 0;
  console.log('\n==================================================');
  console.log('              IMAGE PROCESSING REPORT             ');
  console.log('==================================================');
  console.log(`Images Found:             ${report.found}`);
  console.log(`Images Downloaded:        ${report.downloaded}`);
  console.log(`Images Converted to WebP: ${report.converted}`);
  console.log(`Average Size:             ${avgSize} KB`);
  console.log(`References Updated:       ${report.referencesUpdated}`);
  console.log(`Failed Downloads:         ${report.failed}`);
  console.log('==================================================');

  if (report.failed > 0) {
    console.log('\nFailures details:');
    report.failuresList.forEach(fail => {
      console.log(`- URL: ${fail.url}`);
      console.log(`  Error: ${fail.error}`);
    });
  }
  
  console.log('\nAll processing completed successfully.');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
