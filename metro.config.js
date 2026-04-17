const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support .mjs files (needed for @supabase packages)
config.resolver.sourceExts.push('mjs');

// Enable package exports resolution (fixes @supabase/postgrest-js warning)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
