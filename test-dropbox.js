// Test script for Dropbox integration
// Run with: node test-dropbox.js

const { dropboxService } = require('./services/dropbox');

async function testDropboxConnection() {
  console.log('🧪 Testing Dropbox connection...');
  
  try {
    // Test listing PDFs
    console.log('📋 Testing PDF listing...');
    const pdfs = await dropboxService.listPDFs();
    console.log('✅ PDFs found:', pdfs.length);
    
    if (pdfs.length > 0) {
      console.log('📄 Sample PDF:', pdfs[0]);
    }
    
    console.log('✅ Dropbox connection successful!');
  } catch (error) {
    console.error('❌ Dropbox connection failed:', error.message);
    console.log('💡 Make sure you have:');
    console.log('   1. Created a Dropbox app');
    console.log('   2. Generated an access token');
    console.log('   3. Added the token to your environment variables');
    console.log('   4. Created the band-cue-pdfs folder in your Dropbox');
  }
}

// Run the test
testDropboxConnection(); 